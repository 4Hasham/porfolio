// Orchestrator: owns the renderer, scene graph, and render loop, and wires
// together the smaller, single-purpose modules (backdrop, particle layers,
// shooting stars, camera rig, postprocessing). Nothing here contains shader
// code or texture logic itself — that lives in its own file — so this class
// stays readable as a table of contents for the scene.

import * as THREE from 'three';
import { createBackdrop } from './backdrop.js';
import { createParticleField } from './particles.js';
import { createShootingStars } from './shootingStars.js';
import { createComposer } from './bloom.js';
import { createCameraRig } from './cameraRig.js';

const BACKDROP_IMAGE = '/images/deosai_sky.jpeg';

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.timer = new THREE.Timer();

    this._initRenderer();
    this._initSceneAndCamera();
    this._initObjects();
    this._initComposer();

    window.addEventListener('resize', () => this._onResize());
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  _initSceneAndCamera() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, 4, 22);
  }

  _initObjects() {
    this.backdrop = createBackdrop(this.camera, BACKDROP_IMAGE);
    this.scene.add(this.backdrop.mesh);

    // Distant, cool, mostly-still stars — extra depth between the camera and
    // the photo backdrop, so the sky doesn't read as a single flat layer.
    this.stars = createParticleField({
      count: 260,
      color: 0xdfe8ff,
      xRange: [-110, 110],
      yRange: [5, 65],
      zRange: [-135, -60],
      scaleRange: [0.4, 1.0],
      drift: 0.15,
      opacity: 0.8,
    });
    this.scene.add(this.stars.points);

    // Close, warm, actively-drifting fireflies — the layer nearest the
    // camera, so it sweeps the most as the camera rig looks around.
    this.fireflies = createParticleField({
      count: 200,
      color: 0xffc27a,
      xRange: [-45, 45],
      yRange: [-2, 11],
      zRange: [-32, -2],
      scaleRange: [0.7, 1.6],
      drift: 1.8,
    });
    this.scene.add(this.fireflies.points);

    this.shootingStars = createShootingStars();
    this.scene.add(this.shootingStars.group);

    this.cameraRig = createCameraRig(this.camera);
  }

  _initComposer() {
    const { composer, bloom } = createComposer(this.renderer, this.scene, this.camera, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.composer = composer;
    this.bloom = bloom;
  }

  _onResize() {
    const { innerWidth, innerHeight } = window;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.composer.setSize(innerWidth, innerHeight);
    this.backdrop.resize();
  }

  /** @param {number} value - 0 (top of page) to 1 (bottom) */
  setScrollProgress(value) {
    this.cameraRig.setScrollProgress(value);
  }

  update() {
    this.timer.update();
    const elapsed = this.timer.getElapsed();

    this.backdrop.update(elapsed);
    this.stars.update(elapsed);
    this.fireflies.update(elapsed);
    this.shootingStars.update(elapsed);
    this.cameraRig.update(elapsed);

    this.composer.render();
  }
}
