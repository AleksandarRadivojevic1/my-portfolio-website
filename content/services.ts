// Services section: package ladder, maintenance table, sales process steps.
// Structural facts only (ids, prices, ordering). Human-readable copy (package
// feature bullets, process step descriptions, table cells) lives in
// messages/*.json, keyed by these ids/verticalsKeys.
//
// CONFIDENTIAL GUARD: never add Optika Cajs's confidential one-time price or its
// founding-client maintenance figures anywhere in this file (see
// content/content.test.ts for the exact guarded strings).

export type PackageId = 'start' | 'standard' | 'plus' | 'app';

export interface Package {
  id: PackageId;
  /** Verbatim display price — dot thousand-separators, single "€" prefix, en-dash range. */
  priceLabel: string;
  /** Message-catalog key for this package's translated copy (name, blurb, feature bullets). */
  verticalsKey: string;
}

export const PACKAGES: Package[] = [
  { id: 'start', priceLabel: '€300–500', verticalsKey: 'start' },
  { id: 'standard', priceLabel: '€600–1.500', verticalsKey: 'standard' },
  { id: 'plus', priceLabel: '€1.200–2.500', verticalsKey: 'plus' },
  { id: 'app', priceLabel: 'od €3.000', verticalsKey: 'app' },
];

export interface MaintenanceTier {
  month: string;
  year: string;
}

export interface MaintenanceTable {
  site: MaintenanceTier;
  app: MaintenanceTier;
}

export const MAINTENANCE: MaintenanceTable = {
  site: { month: '€50', year: '€540' },
  app: { month: '€90', year: '€950' },
};

export interface ProcessStep {
  /** Stable key for looking up translated copy, e.g. "process.talk.title". */
  id: 'talk' | 'offer' | 'build' | 'launch' | 'maintain';
  /** 1-based order for section-counter style numbering (01, 02, ...). */
  step: number;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { id: 'talk', step: 1 },
  { id: 'offer', step: 2 },
  { id: 'build', step: 3 },
  { id: 'launch', step: 4 },
  { id: 'maintain', step: 5 },
];
