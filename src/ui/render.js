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
  skills.forEach((skill) => {
    const item = el('li', 'skills__item panel', skill);
    list.appendChild(item);
  });
}

function renderTimeline() {
  const list = document.getElementById('timeline-list');
  timeline.forEach((entry) => {
    const item = el('li', 'timeline__item');
    item.innerHTML = `
      <div class="timeline__marker" aria-hidden="true"></div>
      <div class="timeline__content">
        <p class="timeline__period">${entry.period}</p>
        <h3 class="timeline__role">${entry.role}</h3>
        <p class="timeline__org">${entry.org}</p>
        <p class="timeline__summary">${entry.summary}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderProjects() {
  const list = document.getElementById('projects-list');
  projects.forEach((project) => {
    const card = el('article', 'project-card panel');
    const image = project.image
      ? `<div class="project-card__image"><img src="${project.image}" alt="${project.name} screenshot" loading="lazy" /></div>`
      : '';
    card.innerHTML = `
      ${image}
      <div class="project-card__body">
        <p class="project-card__tag">${project.tag}</p>
        <h3 class="project-card__name">${project.name}</h3>
        <p class="project-card__description">${project.description}</p>
        <ul class="project-card__stack">
          ${project.stack.map((tech) => `<li>${tech}</li>`).join('')}
        </ul>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderInterests() {
  const list = document.getElementById('interests-list');
  interests.forEach((interest) => {
    const card = el('div', 'interest-card panel');
    card.innerHTML = `
      <div class="interest-card__body">
        <h3 class="interest-card__label">${interest.label}</h3>
        <p class="interest-card__detail">${interest.detail}</p>
      </div>
    `;
    list.appendChild(card);
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
    if (entry.href) wrapper.href = entry.href;
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
