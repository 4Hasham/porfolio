// Postprocessing: adds a soft glow ("bloom") to bright pixels — the stars,
// fireflies, shooting stars, and the Milky Way core in the backdrop photo —
// which is what sells a glowing night sky instead of a flatly lit photo.

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export function createComposer(renderer, scene, camera, size) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.width, size.height),
    1.15, // strength
    0.65, // radius
    0.5 // luminance threshold
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  return { composer, bloom };
}
