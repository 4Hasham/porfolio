// Occasional meteor streaks — a small pool of thin, glowing planes that
// spawn at a random point in the sky, fly a short distance, and fade out.
// This is the scene's single most legible "something is happening" moment,
// on top of the more ambient parallax/drift/particle motion.

import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uAlpha;

  void main() {
    // Bright at the head (vUv.x near 1), fading to nothing at the tail.
    float head = pow(vUv.x, 3.0);
    // Soften the strip's top/bottom edges instead of a hard rectangle.
    float edge = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
    gl_FragColor = vec4(uColor, head * edge * uAlpha);
  }
`;

const SPAWN_X = [-70, 70];
const SPAWN_Y = [22, 55];
const SPAWN_Z = [-110, -40];
const STREAK_LENGTH = 14;
const STREAK_THICKNESS = 0.22;
const TRAVEL_DISTANCE = STREAK_LENGTH * 6;
const DURATION = 1.4; // seconds, per streak
const MIN_INTERVAL = 4;
const MAX_INTERVAL = 9;

function randomIn(min, max) {
  return min + Math.random() * (max - min);
}

function createStreakMesh() {
  const geometry = new THREE.PlaneGeometry(STREAK_LENGTH, STREAK_THICKNESS);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(0xeaf2ff) },
      uAlpha: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  return mesh;
}

export function createShootingStars(count = 2) {
  const group = new THREE.Group();

  const slots = Array.from({ length: count }, (_, i) => {
    const mesh = createStreakMesh();
    group.add(mesh);
    return {
      mesh,
      active: false,
      start: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      spawnTime: 0,
      // Stagger initial spawns so both slots don't fire at once.
      nextSpawn: randomIn(MIN_INTERVAL, MAX_INTERVAL) + i * 4,
    };
  });

  function spawn(slot, time) {
    slot.start.set(randomIn(...SPAWN_X), randomIn(...SPAWN_Y), randomIn(...SPAWN_Z));

    // Mostly downward, angled left or right — how real meteors read.
    const angle = THREE.MathUtils.degToRad(randomIn(200, 250));
    slot.direction.set(Math.cos(angle), Math.sin(angle), 0);

    slot.mesh.rotation.z = angle;
    slot.mesh.position.copy(slot.start);
    slot.spawnTime = time;
    slot.active = true;
    slot.mesh.visible = true;
  }

  function update(time) {
    slots.forEach((slot) => {
      if (!slot.active) {
        if (time >= slot.nextSpawn) spawn(slot, time);
        return;
      }

      const t = (time - slot.spawnTime) / DURATION;
      if (t >= 1) {
        slot.active = false;
        slot.mesh.visible = false;
        slot.nextSpawn = time + randomIn(MIN_INTERVAL, MAX_INTERVAL);
        return;
      }

      slot.mesh.position.copy(slot.start).addScaledVector(slot.direction, t * TRAVEL_DISTANCE);
      slot.mesh.material.uniforms.uAlpha.value = Math.sin(Math.PI * t); // fade in, then out
    });
  }

  return { group, update };
}
