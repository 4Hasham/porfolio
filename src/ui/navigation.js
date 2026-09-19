// Mobile menu toggle + "active section" highlighting in the nav bar.

export function initNavigation() {
  const nav = document.querySelector('.nav');
  const burger = document.getElementById('nav-burger');
  const links = Array.from(document.querySelectorAll('.nav__links a'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight whichever section currently owns the most vertical space
  // in the viewport, rather than firing on every scroll pixel.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.find((l) => l.getAttribute('href') === `#${entry.target.id}`);
        if (!link) return;
        link.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Slim the nav bar down once the hero has been scrolled past.
  const hero = document.getElementById('hero');
  const heroObserver = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('nav--scrolled', !entry.isIntersecting),
    { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
  );
  heroObserver.observe(hero);
}
