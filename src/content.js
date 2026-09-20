// Single source of truth for the page's text content.
// Keeping copy here (instead of hard-coded in HTML) means the DOM-building
// code in ui/* stays generic — it just maps over these arrays.

// `icon` is a simpleicons.org slug — https://cdn.simpleicons.org/<slug>
// serves the brand mark as an SVG, resolved by the visitor's own browser
// (no logo files to source or store here). AWS is the one exception: Amazon
// doesn't allow its logo into simple-icons at all (trademark policy), so
// that entry points straight at a full `iconUrl` (devicon's CDN copy)
// instead of a slug — see ui/render.js for how the two are told apart.
export const skills = [
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'NestJS', icon: 'nestjs' },
  {
    name: 'AWS',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Redis', icon: 'redis' },
  { name: 'GraphQL', icon: 'graphql' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Linux', icon: 'linux' },
  { name: 'Git', icon: 'git' },
  { name: 'JSON Web Tokens', icon: 'jsonwebtokens' },
  { name: 'Socket.IO', icon: 'socketdotio' },
];

export const timeline = [
  {
    role: 'Lead Technical Consultant',
    org: 'CESVI Pakistan — PDMA Sindh',
    period: 'Oct 2025 — Present',
    summary:
      'Modernized the Disaster Management Information System (DMIS) for Provincial Disaster Management Authority Sindh: automated data-ingestion pipelines, mentored two consultants, and served as the technical escalation point for the Provincial Emergency Operations Center.',
    logo: '/images/CESVI_idXLKAMfvh_0.png',
  },
  {
    role: 'Backend Specialist',
    org: 'WeatherWalay',
    period: 'May 2023 — Present',
    summary:
      'Designed a custom AWS architecture centralizing global weather data streams at 99.9% uptime. Led backend development of the Pakistan Meteorological Department’s national data warehousing portal, spanning 50+ years of meteorological records.',
    logo: '/images/00_WW_LOGOMARK.png',
  },
  {
    role: 'Full Stack Web Developer',
    org: 'Esper Solutions',
    period: 'Jul 2022 — May 2023',
    summary:
      'Engineered SuiteCRM deployments across 3 international firms and wrote core business-logic addons, plus integrated client-owned Drupal sites with existing CRM software.',
    logo: '/images/esper.png',
  },
  {
    role: 'Software Consultant',
    org: 'BARO',
    period: 'Sep 2020 — Nov 2020',
    summary:
      'Built the landing page for a new company website and a multi-step customer onboarding form, both in Angular using Angular Forms.',
    logo: '/images/baro_vehicles_ltd_logo.jpg',
  },
];

export const projects = [
  {
    name: 'Candlin',
    tag: 'Client project · Sole developer & architect',
    description:
      'Real-estate listings and lead-generation platform. Backend APIs, Stripe payments, third-party listing integrations (Alto, Zoopla), and n8n-driven ops automation, hosted on AWS.',
    stack: ['NestJS', 'Stripe', 'n8n', 'AWS'],
    image: '/images/candlin.png',
    url: 'https://candlin-website.vercel.app',
  },
  {
    name: 'Broadsheet',
    tag: 'Personal product · Founder & sole developer',
    description:
      'A production-ready Next.js 16 + Sanity CMS boilerplate with the article types, layout system, and editorial schema already built — so publishers ship the publication, not the plumbing.',
    stack: ['Next.js 16', 'Sanity CMS'],
    image: '/images/logo_dark.png',
    url: 'https://broadsheetkit.com',
  },
  {
    name: 'ESFC',
    tag: 'Erasmus+ EU Project · Sole developer & architect',
    description:
      'EU-funded (Erasmus+) project platform built end-to-end in Next.js, taken solo from architecture through deployment.',
    stack: ['Next.js'],
    image: '/images/esfc.png',
    url: 'https://esfc-project.com',
  },
  {
    name: 'PMD Weather Portal',
    tag: 'WeatherWalay',
    description:
      'National weather data warehouse and B2C portal serving 50+ years of meteorological records, with secure auth and geolocation APIs for the Pakistan Meteorological Department.',
    stack: ['Node.js', 'NestJS', 'AWS Lambda', 'ECS Fargate', 'MongoDB'],
    image: '/images/pmd-hub.png',
    url: 'https://portal.pmd.gov.pk',
  },
];

export const interests = [
  { label: 'Mountain biking', detail: 'Trading server logs for switchbacks whenever the weather (and the deadlines) allow.' },
  { label: 'Cricket', detail: 'Lifelong follower — nothing beats a tense last over.' },
  { label: 'UFC', detail: 'Fight-night regular; I appreciate a well-executed game plan in any arena.' },
  {
    label: 'Nature & trails',
    detail: 'Mountains are where I go to think clearly and switch off.',
  },
  {
    label: 'Photography',
    detail: 'Chasing dark skies and the Milky Way whenever I can get far enough from city lights.',
  },
  { label: 'Gym', detail: "Consistency over size — still very much a work in progress." },
];

export const portrait = {
  src: '/images/hasham_portrait_deosai.jpeg',
  alt: 'Hasham Ali looking out over a river in the Deosai plains',
};

export const certBadge = {
  src: '/images/aws-certified-solutions-architect-associate.png',
  alt: 'AWS Certified Solutions Architect – Associate badge',
};

export const contactLinks = [
  { label: 'Email', value: 'hasham82ali@gmail.com', href: 'mailto:hasham82ali@gmail.com' },
  { label: 'Phone', value: '+92 312 5279732', href: 'tel:+923125279732' },
  { label: 'LinkedIn', value: 'linkedin.com/in/4hasham', href: 'https://linkedin.com/in/4hasham' },
  { label: 'Location', value: 'Islamabad, Pakistan', href: null },
];
