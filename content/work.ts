// Work section: featured case study (Optika Cajs) + featured product (Skedio).
// Structural facts only (ids, stats, stack, URLs). Human-readable copy (tagline,
// challenge narrative, feature/outcome descriptions) lives in messages/*.json,
// keyed by the ids/keys below.
//
// CONFIDENTIAL GUARD: never add Optika Cajs's confidential one-time price or its
// founding-client maintenance figures anywhere in this file. Only the public
// market value (see stats.marketValue below) may appear. See
// content/content.test.ts for the exact guarded strings.

export interface CaseStudyStats {
  pages: string;
  loc: string;
  tests: string;
  marketValue: string;
  effort: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  live: string;
  /** Message-catalog keys for "what was delivered" bullets. */
  features: string[];
  /** Message-catalog keys for "what it means for the business" bullets. */
  outcomes: string[];
  stats: CaseStudyStats;
  stack: string[];
  /** Client quote for the Work section's TestimonialSlot. Absent until collected — see spec §6.1. */
  testimonial?: Testimonial;
}

export const CAJS: CaseStudy = {
  id: 'optika-cajs',
  slug: 'optika-cajs',
  live: 'https://optikacajs.rs',
  features: [
    'shop',
    'configurator',
    'accounts',
    'booking',
    'admin',
    'tech',
    'testing',
    'responsive',
  ],
  outcomes: ['sales', 'booking', 'visibility', 'ownership'],
  stats: {
    pages: '21 + admin',
    loc: '~9.700',
    tests: '24',
    marketValue: '€3.000–6.000',
    effort: '~250–300h',
  },
  stack: ['PostgreSQL', 'Vitest', 'Docker', 'HMAC SHA-256'],
  // NOTE: no quote collected yet — TestimonialSlot renders the "coming soon"
  // state until this is populated. High-priority content task for Alex.
};

export interface WorkItem {
  id: string;
  stack: string[];
  /** Live app URL, when the product has one. */
  live?: string;
  /** Marketing/landing URL, when distinct from the live app. */
  landing?: string;
}

// NOTE: Skedio live/landing URLs and stack are not yet finalized by Alex.
// Populate before shipping the Work section; the Skedio card must not claim
// revenue/customers per spec §6.2 until true.
export const SKEDIO: WorkItem = {
  id: 'skedio',
  stack: [],
};

// --- Desktop-OS Work section --------------------------------------------
// Structural descriptors for the interactive desktop. Copy (folder labels,
// summaries, link labels) lives in messages/*.json under `work.*`. Optika's
// specs/features are pulled from CAJS above; Skedio ships summary + links
// only until real specs exist (no fabricated stats). CONFIDENTIAL GUARD
// still applies — never put Optika confidential figures here.

export type DesktopKind = 'case' | 'product' | 'locked';

export interface DesktopLink {
  /** Full message key path, e.g. 'work.skedio.landingLabel'. */
  labelKey: string;
  href: string;
  external?: boolean;
}

export interface DesktopProject {
  id: string;
  kind: DesktopKind;
  /** Start position within the desktop, as viewport-relative percentages. */
  start: { x: number; y: number };
  links?: DesktopLink[];
}

export const DESKTOP_PROJECTS: DesktopProject[] = [
  {
    id: 'optika-cajs',
    kind: 'case',
    start: { x: 16, y: 24 },
    links: [{ labelKey: 'work.desktop.liveLabel', href: 'https://optikacajs.rs', external: true }],
  },
  {
    id: 'skedio',
    kind: 'product',
    start: { x: 44, y: 42 },
    links: [
      { labelKey: 'work.skedio.landingLabel', href: 'https://skedio.rs', external: true },
      { labelKey: 'work.skedio.appLabel', href: 'https://app.skedio.rs', external: true },
    ],
  },
  { id: 'soon-1', kind: 'locked', start: { x: 70, y: 26 } },
  { id: 'soon-2', kind: 'locked', start: { x: 60, y: 62 } },
];
