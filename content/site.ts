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

/**
 * Public profiles. One list, two consumers: the footer renders them as visible
 * links, and `personJsonLd()` emits the same hrefs as schema.org `sameAs`.
 * Keeping them together means the machine-readable identity claims and the
 * human-clickable ones can never drift apart.
 */
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/AleksandarRadivojevic1' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aleksandar-radivojevic' },
  { label: 'Instagram', href: 'https://www.instagram.com/acko___/' },
] as const;

/**
 * `SITE.phone` above is a *display* string, and it has been written both ways
 * over time — local ("061 230 8522") and international ("+381 61 2308 522").
 * `tel:` hrefs and JSON-LD both want one absolute E.164 form.
 *
 * This lives here, next to the value it derives from, because the conversion
 * was previously duplicated in three places and two of them assumed the local
 * format — which produced "+381+381612308522" in the contact link and in the
 * telephone field of every page's structured data. One caller, one rule.
 */
export function phoneE164(): string {
  const digits = SITE.phone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : `+381${digits.replace(/^0/, '')}`;
}
