// A small set of hand-drawn line icons standing in for the brand mark.
// Kept as raw SVG strings (viewBox 0 0 24 24, stroke = currentColor) so they
// inherit whatever color/size the container gives them, and swap cleanly via
// innerHTML in iconCycler.js.

export const icons = [
  {
    name: 'bike',
    label: 'Motorcycle — my YBR 125G',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5.5" cy="17" r="2.6"/>
      <circle cx="18" cy="17" r="2.6"/>
      <path d="M5.5 17h4.5l2.3-5.2h4.3"/>
      <path d="M8.8 12.3l1.7-3h3.2"/>
      <path d="M14 9.3h3.4l0.9 2.4"/>
      <path d="M16.3 9.3V7h2.1"/>
      <path d="M12.3 17h5.7"/>
    </svg>`,
  },
  {
    name: 'cricket',
    label: 'Cricket bat',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.8 3.6l5.6 5.6-6.9 6.9-5.6-5.6z"/>
      <path d="M12.1 11.9L5.4 18.6"/>
      <path d="M5.4 18.6l-1.8 1.8"/>
      <circle cx="19.3" cy="19.3" r="1.2" fill="currentColor" stroke="none"/>
    </svg>`,
  },
  {
    name: 'gym',
    label: 'Dumbbell',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="9.5" width="2.6" height="5" rx="0.8"/>
      <rect x="19.4" y="9.5" width="2.6" height="5" rx="0.8"/>
      <rect x="6.6" y="8" width="2" height="8" rx="0.6"/>
      <rect x="15.4" y="8" width="2" height="8" rx="0.6"/>
      <path d="M8.6 12h6.8"/>
    </svg>`,
  },
  {
    name: 'code',
    label: 'Code',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 8.5L4.5 12 9 15.5"/>
      <path d="M15 8.5l4.5 3.5-4.5 3.5"/>
      <path d="M13.2 5.5l-2.4 13"/>
    </svg>`,
  },
];
