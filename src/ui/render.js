// Turns the plain data in content.js into DOM nodes.
// Nothing here knows about Three.js — it's pure content rendering.

import { skills, timeline, projects, interests, contactLinks, portrait, certBadge } from '../content.js';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderSkills() {
  const list = document.getElementById('skills-list');
  // Rendered twice back to back so the marquee animation (a translate by
  // exactly -50%, horizontal on desktop / vertical on mobile) can loop
  // seamlessly — as the first copy scrolls fully out of view, the second
  // is right there to take its place unnoticed.
  const logos = [...skills, ...skills]
    .map((skill) => {
      const src = skill.iconUrl || `https://cdn.simpleicons.org/${skill.icon}/eef1ff`;
      return `
        <li class="nav__skills-item" title="${skill.name}">
          <img src="${src}" alt="${skill.name}" loading="lazy" />
        </li>
      `;
    })
    .join('');
  list.innerHTML = logos;
}

function renderTimeline() {
  const list = document.getElementById('timeline-list');
  timeline.forEach((entry, i) => {
    const item = el('div', 'hscroll__item timeline-slide');
    item.innerHTML = `
      <div class="timeline-slide__inner panel">
        <span class="timeline-slide__index">0${i + 1}</span>
        <p class="timeline-slide__period">${entry.period}</p>
        <h3 class="timeline-slide__role">${entry.role}</h3>
        <p class="timeline-slide__org">${entry.org}</p>
        <p class="timeline-slide__summary">${entry.summary}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderProjects() {
  const list = document.getElementById('projects-list');
  projects.forEach((project) => {
    const item = el('div', 'hscroll__item project-slide');
    const image = project.image
      ? `<div class="project-slide__image"><img src="${project.image}" alt="${project.name} screenshot" loading="lazy" /></div>`
      : '';
    const linkAttrs = project.url ? `href="${project.url}" target="_blank" rel="noopener noreferrer"` : '';
    const tag = project.url ? 'a' : 'div';
    item.innerHTML = `
      <${tag} class="project-slide__inner panel" ${linkAttrs}>
        ${image}
        <div class="project-slide__body">
          <p class="project-slide__tag">${project.tag}</p>
          <h3 class="project-slide__name">${project.name}</h3>
          <p class="project-slide__description">${project.description}</p>
          <ul class="project-slide__stack">
            ${project.stack.map((tech) => `<li>${tech}</li>`).join('')}
          </ul>
        </div>
      </${tag}>
    `;
    list.appendChild(item);
  });
}

function renderInterests() {
  const list = document.getElementById('interests-list');
  interests.forEach((interest) => {
    const item = el('div', 'hscroll__item interest-slide');
    item.innerHTML = `
      <div class="interest-slide__inner panel">
        <h3 class="interest-slide__label">${interest.label}</h3>
        <p class="interest-slide__detail">${interest.detail}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderAbout() {
  const portraitImg = document.getElementById('about-portrait-img');
  portraitImg.src = portrait.src;
  portraitImg.alt = portrait.alt;

  const badgeImg = document.getElementById('about-cert-badge');
  badgeImg.src = certBadge.src;
  badgeImg.alt = certBadge.alt;
}

function renderContact() {
  const list = document.getElementById('contact-list');
  contactLinks.forEach((entry) => {
    const wrapper = entry.href ? el('a', 'contact-card panel') : el('div', 'contact-card panel');
    if (entry.href) {
      wrapper.href = entry.href;
      wrapper.target = '_blank';
      wrapper.rel = 'noopener noreferrer';
    }
    wrapper.innerHTML = `
      <span class="contact-card__label">${entry.label}</span>
      <span class="contact-card__value">${entry.value}</span>
    `;
    list.appendChild(wrapper);
  });
}

export function renderContent() {
  renderAbout();
  renderSkills();
  renderTimeline();
  renderProjects();
  renderInterests();
  renderContact();
  document.getElementById('year').textContent = new Date().getFullYear();
}
