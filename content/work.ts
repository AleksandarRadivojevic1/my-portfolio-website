// Work section: featured case study (Optika Cajs) + featured product (Skedio).
// Structural facts only (ids, stats, stack, URLs). Human-readable copy (tagline,
// challenge narrative, feature/outcome descriptions) lives in messages/*.json,
// keyed by the ids/keys below.
//
// CONFIDENTIAL GUARD: never add Optika Cajs's confidential one-time price or its
// founding-client maintenance figures anywhere in this file. Only the public
// market value (see stats.marketValue below) may appear. See
// content/content.test.ts for the exact guarded strings.

/**
 * Ship dates, ISO 8601 (YYYY-MM-DD). Consumed by `caseStudyJsonLd()` as
 * schema.org datePublished/dateModified.
 *
 * Optional on purpose: a wrong date is worse than no date here. Both fields are
 * *recommended*, not required, for CreativeWork — but they're machine-readable
 * claims, so Google and AI crawlers will repeat whatever we put here. Leave
 * undefined until the real date is known rather than approximating.
 */
export interface ProjectDates {
  /** When the project first shipped to production. */
  published: string;
  /** Last substantive update. Omit when it's never been revised. */
  modified?: string;
}

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
  /** Ship dates for structured data. Absent until Alex confirms them. */
  dates?: ProjectDates;
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
  stack: ['Next.js', 'TypeScript', 'React', 'Tailwind', 'Prisma', 'PostgreSQL', 'Docker', 'Vitest'],
  // Go-live. The shop is hosted on the client's Vercel account, so there's no
  // deploy history reachable from here to confirm it against — this is the date
  // of the launch-prep commits in cajs-optika (branded 404, error boundaries,
  // real 404 status codes, SEO pass), confirmed by Alex as the handoff.
  // No `modified`: nothing has been revised since.
  dates: { published: '2026-07-18' },
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
  /** Ship dates for structured data. Absent until Alex confirms them. */
  dates?: ProjectDates;
}

// NOTE: Skedio live/landing URLs and stack are not yet finalized by Alex.
// Populate before shipping the Work section; the Skedio card must not claim
// revenue/customers per spec §6.2 until true.
export const SKEDIO: WorkItem = {
  id: 'skedio',
  stack: [],
  // Skedio is split across two repos: the app (saas-project-app, first commit
  // 2026-04-29) and the marketing site (skedio-landing). `published` is when
  // the *product* first became publicly reachable — the landing page's Vercel
  // project creation — not when the app repo started. A start date in
  // datePublished would read to Google as a launch date, which it isn't.
  // `modified` is the last commit across both repos.
  dates: { published: '2026-06-03', modified: '2026-06-08' },
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

// --- Skedio case study --------------------------------------------------
// Structural facts for the Skedio case-study page. Copy lives in
// messages/*.json under caseSkedio.*. Skedio is a self-built, pre-launch
// product: NO usage/revenue/customer claims, and NO "tests" stat (the app
// has none). Numbers below are structural (measured from the app repo).

export interface SkedioStats {
  loc: string;
  screens: string;
  endpoints: string;
  migrations: string;
  integrations: string;
}

export interface CaseScreenshot {
  /** Public path under /work/skedio/. */
  src: string;
  /** Message key under caseSkedio.shots.* for alt text. */
  altKey: string;
  /** Tailwind aspect-ratio class for the frame. */
  aspect: string;
}

export interface SkedioCase {
  id: string;
  slug: string;
  landing: string;
  app: string;
  /** Message keys under caseSkedio.features.* */
  features: string[];
  /** Message keys under caseSkedio.engineering.* */
  engineering: string[];
  stats: SkedioStats;
  stack: string[];
  screenshots: CaseScreenshot[];
}

export const SKEDIO_CASE: SkedioCase = {
  id: 'skedio',
  slug: 'skedio',
  landing: 'https://skedio.rs',
  app: 'https://app.skedio.rs',
  features: ['booking', 'calendar', 'crm', 'staff', 'services', 'analytics', 'reminders', 'onboarding'],
  engineering: ['data', 'billing', 'whatsapp', 'email', 'timezone', 'availability'],
  stats: {
    loc: '~11.000',
    screens: '17',
    endpoints: '8',
    migrations: '6',
    integrations: '5',
  },
  stack: ['Next.js 16', 'TypeScript', 'Supabase', 'PostgreSQL', 'Lemon Squeezy', 'Twilio', 'Resend', 'Sentry'],
  screenshots: [
    { src: '/work/skedio/dashboard.webp', altKey: 'dashboard', aspect: 'aspect-[16/10]' },
    { src: '/work/skedio/calendar.png', altKey: 'calendar', aspect: 'aspect-[16/10]' },
    { src: '/work/skedio/clients.png', altKey: 'clients', aspect: 'aspect-[16/10]' },
    { src: '/work/skedio/staff.png', altKey: 'staff', aspect: 'aspect-[16/10]' },
  ],
};
