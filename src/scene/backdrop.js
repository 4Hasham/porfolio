// The scene's backdrop: a real photograph on a single large plane, instead
// of a procedurally generated sky/terrain. It sits far behind the camera
// and fills the entire view, with two small touches of life:
//  - a slow "Ken Burns" breathing zoom, so it never looks like a static image
//  - texture UV cropping so the photo always fully covers the screen
//    (like CSS `object-fit: cover`) no matter the window's aspect ratio
//
// The existing camera rig (mouse parallax + idle sway) already makes a
// single flat plane feel alive as the view shifts across it — no need for
// multiple depth layers.

import * as THREE from 'three';

const DISTANCE_FROM_CAMERA = 150; // how far back the plane sits, in world units
const COVER_PADDING = 1.6; // extra size so parallax/sway never reveals an edge
const KEN_BURNS_AMOUNT = 0.09; // max extra zoom, as a fraction (0.09 = 9%)
const KEN_BURNS_SPEED = 0.06; // radians/second

/**
 * How tall/wide a plane needs to be, at a given distance from the camera,
 * to fully fill its view frustum.
 */
function frustumSizeAtDistance(camera, distance) {
  const height = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const width = height * camera.aspect;
  return { width, height };
}

/**
 * Adjusts a texture's repeat/offset so an image of a different aspect ratio
 * than its container crops (rather than stretches) to fill it — the WebGL
 * equivalent of `background-size: cover`.
 */
function applyCoverUV(texture, containerAspect, imageAspect) {
  if (containerAspect > imageAspect) {
    const scale = imageAspect / containerAspect;
    texture.repeat.set(1, scale);
    texture.offset.set(0, (1 - scale) / 2);
  } else {
    const scale = containerAspect / imageAspect;
    texture.repeat.set(scale, 1);
    texture.offset.set((1 - scale) / 2, 0);
  }
}

export function createBackdrop(camera, imageUrl) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, -DISTANCE_FROM_CAMERA);

  let imageAspect = 1;

  new THREE.TextureLoader().load(imageUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    imageAspect = texture.image.width / texture.image.height;
    material.map = texture;
    material.color.set(0xffffff);
    material.needsUpdate = true;
    resize();
  });

  function resize() {
    const { width, height } = frustumSizeAtDistance(camera, DISTANCE_FROM_CAMERA);
    mesh.userData.baseWidth = width * COVER_PADDING;
    mesh.userData.baseHeight = height * COVER_PADDING;
    if (material.map) {
      applyCoverUV(material.map, mesh.userData.baseWidth / mesh.userData.baseHeight, imageAspect);
    }
  }

  function update(time) {
    if (!mesh.userData.baseWidth) return;
    const zoom = 1 + KEN_BURNS_AMOUNT * (0.5 + 0.5 * Math.sin(time * KEN_BURNS_SPEED));
    mesh.scale.set(mesh.userData.baseWidth * zoom, mesh.userData.baseHeight * zoom, 1);
  }

  resize();

  return { mesh, update, resize };
}
