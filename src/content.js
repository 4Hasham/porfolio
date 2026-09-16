// Single source of truth for the page's text content.
// Keeping copy here (instead of hard-coded in HTML) means the DOM-building
// code in ui/* stays generic — it just maps over these arrays.

export const skills = [
  'Node.js',
  'NestJS',
  'AWS (Solutions Architect)',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'GraphQL',
  'REST & WebSockets',
  'Docker & Linux',
  'CI/CD (Git)',
  'JWT & OAuth',
  'Test-Driven Development',
];

export const timeline = [
  {
    role: 'Lead Technical Consultant',
    org: 'CESVI Pakistan — PDMA Sindh',
    period: 'Oct 2025 — Present',
    summary:
      'Modernized the Disaster Management Information System (DMIS) for Provincial Disaster Management Authority Sindh: automated data-ingestion pipelines, mentored two consultants, and served as the technical escalation point for the Provincial Emergency Operations Center.',
  },
  {
    role: 'Backend Specialist',
    org: 'WeatherWalay',
    period: 'May 2023 — Present',
    summary:
      'Designed a custom AWS architecture centralizing global weather data streams at 99.9% uptime. Led backend development of the Pakistan Meteorological Department’s national data warehousing portal, spanning 50+ years of meteorological records.',
  },
  {
    role: 'CRM Developer',
    org: 'Esper Solutions',
    period: 'Jul 2022 — Apr 2023',
    summary:
      'Owned end-to-end architecture for SuiteCRM deployments across 3 international firms, engineering core business-logic modules relied on for daily operations.',
  },
];

export const projects = [
  {
    name: 'PMD Weather Portal',
    tag: 'WeatherWalay',
    description:
      'National weather data warehouse and B2C portal serving 50+ years of meteorological records, with secure auth and geolocation APIs for the Pakistan Meteorological Department.',
    stack: ['Node.js', 'NestJS', 'AWS Lambda', 'ECS Fargate', 'MongoDB'],
    image: '/images/pmd-hub.png',
  },
  {
    name: 'Candlin',
    tag: 'Client project · Sole developer & architect',
    description:
      'Real-estate listings and lead-generation platform. Backend APIs, Stripe payments, third-party listing integrations (Alto, Zoopla), and n8n-driven ops automation, hosted on AWS.',
    stack: ['NestJS', 'Stripe', 'n8n', 'AWS'],
    image: '/images/candlin.png',
  },
  {
    name: 'Broadsheet',
    tag: 'Client project',
    description:
      'News and lifestyle site for a UAE media outlet: articles, podcasts, and visual stories on a Sanity.io-powered CMS, with a ranking system driving what the homepage surfaces.',
    stack: ['Next.js', 'Sanity.io', 'Netlify'],
    image: '/images/broadsheet.png',
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
