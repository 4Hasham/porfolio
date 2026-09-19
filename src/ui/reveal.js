// Fades + lifts elements into place as they enter the viewport.
// Uses IntersectionObserver instead of a scroll listener so the browser
// only does work when something is actually about to become visible.

export function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section__heading, .about__portrait, .about__copy, .about__facts, .skills__item, ' +
      '.timeline__item, .project-card, .interest-card, .contact-card'
  );

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
