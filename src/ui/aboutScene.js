// Drives the About section's staged reveal: the portrait starts big and
// centered with a short greeting, then — as the visitor keeps scrolling
// through this pinned section — shrinks/settles into its normal spot while
// the facts panel fades in, and finally the bio copy fades in beside it.
//
// The three elements' final positions are always their normal (small,
// side-by-side) layout — nothing is repositioned in the DOM. The "big and
// centered" look at the start is faked with a CSS transform on the
// portrait alone (translate + scale from its natural spot to viewport
// center), which is cheap to animate and never triggers layout.

import { observeScrollStage } from './scrollStage.js';

const STAGE_COUNT = 3; // portrait+greeting -> facts -> bio copy
const BIG_PORTRAIT_WIDTH_RATIO = 0.4; // fraction of viewport width, at rest

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;

const MOBILE_QUERY = '(max-width: 860px)';

export function initAboutScene(root = document.getElementById('about')) {
  if (!root) return;

  // Below 860px this becomes a plain, statically laid-out card instead of
  // a scroll-driven reveal (see the mobile override in style.css): the
  // scroll-jacked "big portrait shrinking into place while panels fade in"
  // animation — three separately-transformed, partly absolutely-positioned
  // pieces — turned out to just feel jerky and disjointed on an actual
  // phone, not polished. Skipping this entirely lets every element sit at
  // its plain CSS position with nothing to desync. Doesn't re-check on
  // resize/rotation — this is a portfolio site, not a resizable app, and
  // the added complexity of handling a live breakpoint crossing isn't
  // worth it here.
  if (window.matchMedia(MOBILE_QUERY).matches) return;

  const sticky = root.querySelector('.scroll-stage__sticky');
  const portrait = root.querySelector('.about-scene__portrait');
  const greeting = root.querySelector('.about-scene__greeting');
  const facts = root.querySelector('.about-scene__facts');
  const copy = root.querySelector('.about-scene__copy');
  if (!sticky || !portrait || !greeting || !facts || !copy) return;

  // Belt and suspenders alongside the fixed width in style.css: if the
  // portrait <img> hasn't finished loading yet when this first measures,
  // re-measure once it has, via the resize listener scrollStage.js already
  // has wired up.
  const portraitImg = portrait.querySelector('img');
  if (portraitImg && !portraitImg.complete) {
    portraitImg.addEventListener('load', () => window.dispatchEvent(new Event('resize')), { once: true });
  }

  let bigTransform = { dx: 0, dy: 0, scale: 1 };

  observeScrollStage(root, STAGE_COUNT, {
    onMeasure(vh, vw) {
      // Natural (final, small) position of the portrait, expressed relative
      // to the sticky container rather than the viewport: measuring happens
      // at page load, before this section has scrolled into its pinned
      // position, so a raw getBoundingClientRect() on the portrait would be
      // wherever it sits in the document — nowhere near the viewport. The
      // offset from the sticky box's own corner, though, is unaffected by
      // scroll position, and equals viewport coordinates once pinned (the
      // sticky box IS the viewport then), which is what all the "big and
      // centered" math below assumes.
      //
      // getBoundingClientRect() reflects the *rendered* box, transform
      // included — and by the time this re-measures (e.g. once the
      // portrait <img> finishes loading, after onProgress has already run
      // at least once), the portrait already has a transform on it from
      // the line at the bottom of this function. Measuring that would feed
      // an already-transformed size back in as if it were the natural one,
      // compounding on every re-measure. Clearing it first, synchronously,
      // avoids that — nothing repaints between this and onProgress
      // reapplying the correct transform right after.
      const previousTransform = portrait.style.transform;
      portrait.style.transform = 'none';
      const stickyRect = sticky.getBoundingClientRect();
      const rect = portrait.getBoundingClientRect();
      const naturalCenterX = rect.left - stickyRect.left + rect.width / 2;
      const naturalCenterY = rect.top - stickyRect.top + rect.height / 2;
      portrait.style.transform = previousTransform;

      const bigWidth = Math.min(vw * BIG_PORTRAIT_WIDTH_RATIO, 420);
      const scale = rect.width > 0 ? bigWidth / rect.width : 1;
      const bigCenterY = vh * 0.42; // slightly above true center

      bigTransform = {
        dx: vw / 2 - naturalCenterX,
        dy: bigCenterY - naturalCenterY,
        scale,
      };

      // Portrait keeps its own aspect ratio (3:4) when scaled up, so its
      // rendered height at "big" size is bigWidth * 4/3.
      const bigHeight = bigWidth * (4 / 3);
      greeting.style.top = `${bigCenterY + bigHeight / 2 + 24}px`;
    },

    onProgress(progress) {
      // Stage 0 -> 1: portrait settles from big/centered to its natural spot,
      // greeting fades out.
      const settle = clamp01(progress / 1);
      const dx = lerp(bigTransform.dx, 0, settle);
      const dy = lerp(bigTransform.dy, 0, settle);
      const scale = lerp(bigTransform.scale, 1, settle);
      portrait.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

      const fadeT = clamp01(progress / 0.7);
      greeting.style.opacity = String(1 - fadeT);
      greeting.style.transform = `translate(-50%, ${lerp(0, -40, fadeT)}px)`;

      // Stage 0.2 -> 1.0: facts fade in, fully settled exactly at the
      // progress=1 snap point (not mid-fade), so scroll-snap always lands
      // on a fully readable state.
      const factsT = clamp01((progress - 0.2) / 0.8);
      facts.style.opacity = String(factsT);
      facts.style.transform = `translateY(${lerp(24, 0, factsT)}px)`;

      // Stage 1.2 -> 2.0: bio copy fades in, fully settled by progress=2.
      const copyT = clamp01((progress - 1.2) / 0.8);
      copy.style.opacity = String(copyT);
      copy.style.transform = `translateY(${lerp(24, 0, copyT)}px)`;
    },
  });
}
