// Fades + lifts elements into place as they enter the viewport.
// Uses IntersectionObserver instead of a scroll listener so the browser
// only does work when something is actually about to become visible.

export function initScrollReveal() {
  // Note: About/Experience/Projects/Interests items are excluded here — their
  // visibility is driven continuously by scroll progress (see scrollStage.js,
  // aboutScene.js, horizontalScroll.js), not a one-shot enter-the-viewport fade.
  // The skills rail is excluded too — it's fixed and always on screen from
  // the start, never "entering" the viewport at all.
  const targets = document.querySelectorAll('.section__heading, .contact-card');

  targets.forEach((target) => target.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}
