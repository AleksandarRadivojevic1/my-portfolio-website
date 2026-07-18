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
