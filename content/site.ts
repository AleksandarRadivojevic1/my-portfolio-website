// Global site facts (contact + brand). Structural data only — no prose.
// Prose/labels for these values live in messages/*.json (e.g. "contact.emailLabel").

export interface SiteInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  domain: string;
}

export const SITE: SiteInfo = {
  name: 'Aleksandar Radivojević',
  email: 'aradivojevic.dev@outlook.com',
  phone: '+381 61 2308 522',
  location: 'Leskovac, RS',
  domain: 'alexrad.dev',
};
