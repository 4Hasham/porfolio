// Shared engine for "tall pinned section" scrollytelling.
//
// A stage is a section made `stageCount` viewport-heights tall — via real
// DOM height (the sticky box itself, plus one .scroll-stage__snap-marker
// per additional item; see style.css), not a JS-computed pixel height —
// with its content pinned via `position: sticky`. While the user scrolls
// through that height with an ordinary wheel/trackpad/touch scroll, we work
// out how far through it they are and report a continuous progress value —
// 0 at the top of the section, (stageCount - 1) once fully scrolled through
// — so the caller can drive whatever visual transition it wants (a
// horizontal slide, a cross-fade, a camera move) without needing its own
// scroll or resize listeners. CSS scroll-snap (also in style.css) makes the
// browser settle exactly on an integer progress value once the user stops
// scrolling, so every transition ends on a fully-readable, stable frame.

const stages = [];

function measure(stage) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  stage.vh = vh;
  stage.vw = vw;
  stage.onMeasure?.(vh, vw);
}

function currentProgress(stage) {
  const { el, count, vh } = stage;
  const scrollable = (count - 1) * vh;
  if (scrollable <= 0) return 0;
  const raw = -el.getBoundingClientRect().top / scrollable;
  return Math.min(Math.max(raw, 0), 1) * (count - 1);
}

function reportProgress(stage) {
  stage.onProgress(currentProgress(stage), stage.vh, stage.vw);
}

function tick() {
  stages.forEach(reportProgress);
}

function onResize() {
  stages.forEach(measure);
  tick();
}

// Registers a stage. `onMeasure(vh, vw)` fires on init and on every resize,
// before any progress is reported — use it to size things that depend on
// viewport dimensions. `onProgress(progress, vh, vw)` fires on init and on
// every scroll tick.
export function observeScrollStage(el, count, { onProgress, onMeasure } = {}) {
  const stage = { el, count, onProgress: onProgress || (() => {}), onMeasure, vh: 0, vw: 0 };
  stages.push(stage);
  measure(stage);
  reportProgress(stage);
}

let bound = false;

// Call once, after all stages for the page have been registered.
export function startScrollStages() {
  if (bound) return;
  bound = true;
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', onResize);

  // Web fonts (and, to a lesser extent, images) can arrive after this first
  // measurement and reflow the page — every stage's height and every
  // element's "natural" position were measured against pre-reflow layout.
  // Re-measuring once things settle keeps that from sticking as a
  // permanently wrong initial state.
  document.fonts?.ready.then(onResize).catch(() => {});
  window.addEventListener('load', onResize);
}
