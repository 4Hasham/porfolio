// Converts a `.hscroll` section (Experience, Projects, Interests) into a
// horizontally-scrolled, one-item-per-viewport experience, using
// scrollStage's pinned-section trick: vertical scroll progress through the
// section drives a horizontal translateX on the item track, and each
// item's opacity/scale falls off with distance from the "in focus" slot.
//
// Items are sized with plain CSS (`width: 100vw` in style.css), so the
// translateX below is expressed in `vw` too — no JS-measured pixel width
// needed, and it stays correct across resizes with zero extra code.
//
// Desktop only. On a real phone this read as flickery and required
// physically dragging each card to advance — the same "scroll-jacking
// doesn't translate well to touch" problem About's animation had. Below
// 860px, style.css turns these sections into a plain vertical list
// instead (see its media query), so there's nothing here for this module
// to drive.

import { observeScrollStage } from './scrollStage.js';

const MOBILE_QUERY = '(max-width: 860px)';
const FOCUS_FALLOFF = 1.4; // how fast an item fades as it leaves center
const SCALE_FALLOFF = 0.1;
const MIN_OPACITY = 0.2;
const MIN_SCALE = 0.88;

export function initHorizontalScrollSections(selector = '.hscroll') {
  if (window.matchMedia(MOBILE_QUERY).matches) return;

  document.querySelectorAll(selector).forEach((section) => {
    const track = section.querySelector('.hscroll__track');
    const items = Array.from(section.querySelectorAll('.hscroll__item'));
    const counter = section.querySelector('.hscroll__label-count');
    if (!track || items.length === 0) return;

    observeScrollStage(section, items.length, {
      onProgress(progress) {
        track.style.transform = `translateX(${-progress * 100}vw)`;

        items.forEach((item, i) => {
          const distance = Math.abs(progress - i);
          item.style.opacity = String(Math.max(1 - distance * FOCUS_FALLOFF, MIN_OPACITY));
          item.style.transform = `scale(${Math.max(1 - distance * SCALE_FALLOFF, MIN_SCALE)})`;
        });

        if (counter) counter.textContent = `${Math.round(progress) + 1} / ${items.length}`;
      },
    });
  });
}
