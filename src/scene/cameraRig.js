// Drives the camera with four blended motions:
//  1. a slow idle position sway, so nearby elements (fireflies) never look frozen
//  2. a slow idle *look* drift, so the backdrop keeps gently panning even
//     when nobody is touching the mouse
//  3. mouse-position parallax, so the backdrop visibly shifts as you look around
//  4. a scroll-linked dolly, so scrolling the page feels like drifting
//     further into the scene
//
// The backdrop photo sits far behind the camera (see backdrop.js), so a small
// sideways nudge of the camera's *position* barely changes what's visible on
// it — the useful lever is the camera's *look direction*. Swinging the
// look-at target (both the idle drift and the mouse parallax) is what
// actually makes a distant plane move; the positional sway just adds a
// little extra life to whatever sits closer to the camera.
//
// All of this is combined into one target position/look-at per frame, and
// the camera eases toward that target rather than snapping to it.

import * as THREE from 'three';

const BASE_POSITION = new THREE.Vector3(0, 4, 22);
const LOOK_TARGET = new THREE.Vector3(0, 2, -20);
const EASE = 0.045;

const IDLE_SWAY_X = 0.6;
const IDLE_SWAY_Y = 0.3;
const IDLE_LOOK_SWAY_X = 3.2; // autonomous pan across the backdrop, visible within a few seconds
const IDLE_LOOK_SWAY_Y = 1.7;
const POSITION_PARALLAX_X = 1.4;
const POSITION_PARALLAX_Y = 0.7;
const LOOK_PARALLAX_X = 3.6; // dominant effect: swivels the view toward the cursor
const LOOK_PARALLAX_Y = 1.8;
const SCROLL_DOLLY_Z = 14;
const SCROLL_DOLLY_Y = 2.5;

export function createCameraRig(camera) {
  const pointer = { x: 0, y: 0 };
  let scrollProgress = 0;

  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  });

  function setScrollProgress(value) {
    scrollProgress = THREE.MathUtils.clamp(value, 0, 1);
  }

  function update(time) {
    const swayX = Math.sin(time * 0.08) * IDLE_SWAY_X;
    const swayY = Math.cos(time * 0.11) * IDLE_SWAY_Y;
    const lookSwayX = Math.sin(time * 0.13) * IDLE_LOOK_SWAY_X;
    const lookSwayY = Math.cos(time * 0.1) * IDLE_LOOK_SWAY_Y;

    const targetX = swayX + pointer.x * POSITION_PARALLAX_X;
    const targetY =
      BASE_POSITION.y - scrollProgress * SCROLL_DOLLY_Y + swayY - pointer.y * POSITION_PARALLAX_Y;
    const targetZ = BASE_POSITION.z - scrollProgress * SCROLL_DOLLY_Z;

    camera.position.x += (targetX - camera.position.x) * EASE;
    camera.position.y += (targetY - camera.position.y) * EASE;
    camera.position.z += (targetZ - camera.position.z) * (EASE + 0.01);

    camera.lookAt(
      LOOK_TARGET.x + lookSwayX + pointer.x * LOOK_PARALLAX_X,
      LOOK_TARGET.y + lookSwayY - pointer.y * LOOK_PARALLAX_Y,
      LOOK_TARGET.z
    );
  }

  return { update, setScrollProgress };
}
