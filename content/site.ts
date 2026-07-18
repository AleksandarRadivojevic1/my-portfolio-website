// Global site facts (contact + brand). Structural data only — no prose.
// Prose/labels for these values live in messages/*.json (e.g. "contact.emailLabel").

export interface SiteInfo {
  email: string;
  phone: string;
  location: string;
  domain: string;
}

export const SITE: SiteInfo = {
  email: 'aradivojevic.dev@outlook.com',
  phone: '061 230 8522',
  location: 'Leskovac, RS',
  domain: 'alexrad.dev',
};
