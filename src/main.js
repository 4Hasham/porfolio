import './style.css';
import { World } from './scene/World.js';
import { renderContent } from './ui/render.js';
import { initScrollReveal } from './ui/reveal.js';
import { initNavigation } from './ui/navigation.js';
import { initIconCycler } from './ui/iconCycler.js';
import { hideLoader } from './ui/loader.js';

// 1. Content first: the page must be readable even if WebGL fails.
renderContent();
initNavigation();
initScrollReveal();
initIconCycler('.icon-cycle'); // loader mark + nav brand, cycling in sync

// 2. The 3D backdrop.
const canvas = document.getElementById('scene-canvas');
const world = new World(canvas);

// Scroll progress (0 -> 1 across the whole page) feeds the camera rig so
// scrolling reads as drifting further into the scene.
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  world.setScrollProgress(progress);
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// 3. Render loop.
function tick() {
  world.update();
  requestAnimationFrame(tick);
}

requestAnimationFrame(() => {
  tick();
  hideLoader();
});
