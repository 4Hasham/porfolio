// Cycles every matched element through the icon set in icons.js, fading
// out the current icon before fading in the next one. Used for the brand
// mark (nav + loader) so it rotates through bike / cricket / gym / code
// instead of settling on one.

import { icons } from './icons.js';

const FADE_MS = 260;

function paint(el, index) {
  el.innerHTML = icons[index].svg;
  const svg = el.firstElementChild;
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

/**
 * @param {string} selector - matches one or more containers to animate in sync
 * @param {{ interval?: number }} [options]
 */
export function initIconCycler(selector, { interval = 2800 } = {}) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  let index = 0;
  elements.forEach((el) => {
    const svg = paint(el, index);
    svg.classList.add('is-visible');
  });

  setInterval(() => {
    elements.forEach((el) => el.firstElementChild?.classList.remove('is-visible'));

    setTimeout(() => {
      index = (index + 1) % icons.length;
      elements.forEach((el) => {
        const svg = paint(el, index);
        requestAnimationFrame(() => svg.classList.add('is-visible'));
      });
    }, FADE_MS);
  }, interval);
}
