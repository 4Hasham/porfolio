// A generic glowing-point swarm, used for both the warm foreground fireflies
// and the cool distant starfield. One Points object + shader handles however
// many particles are requested, so a rich, layered sky costs almost nothing
// to render.
//
// Why two layers matter for "movement": particles placed close to the
// camera sweep across the screen much faster than distant ones as the
// camera rig swivels (ordinary perspective, no extra code needed) — that
// speed *contrast* between layers is what reads as real depth and motion,
// far more than any single layer's own animation does.

import * as THREE from 'three';

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aScale;

  uniform float uTime;
  uniform float uDrift;

  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * 0.3 + aPhase) * uDrift;
    pos.y += sin(uTime * 0.5 + aPhase * 2.0) * uDrift * 0.6 + uDrift * 0.3;
    pos.z += cos(uTime * 0.25 + aPhase) * uDrift;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aScale * (240.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 0.5 + 0.5 * sin(uTime * 2.0 + aPhase * 6.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float glow = smoothstep(0.5, 0.0, length(uv));
    gl_FragColor = vec4(uColor, glow * vAlpha * uOpacity);
  }
`;

/**
 * @param {number} count
 * @param {number} color - hex color
 * @param {[number, number]} xRange
 * @param {[number, number]} yRange
 * @param {[number, number]} zRange
 * @param {[number, number]} scaleRange
 * @param {number} drift - how far particles wander from their base position
 * @param {number} opacity - overall brightness multiplier
 */
export function createParticleField({
  count,
  color,
  xRange,
  yRange,
  zRange,
  scaleRange = [0.6, 1.4],
  drift = 1.6,
  opacity = 1,
}) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const scales = new Float32Array(count);

  const spread = (range) => range[0] + Math.random() * (range[1] - range[0]);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = spread(xRange);
    positions[i * 3 + 1] = spread(yRange);
    positions[i * 3 + 2] = spread(zRange);
    phases[i] = Math.random() * Math.PI * 2;
    scales[i] = spread(scaleRange);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uDrift: { value: drift },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
  });

  const points = new THREE.Points(geometry, material);

  function update(time) {
    material.uniforms.uTime.value = time;
  }

  return { points, update };
}
