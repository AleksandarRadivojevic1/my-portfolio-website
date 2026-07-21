import { SITE, SOCIALS, phoneE164 } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-6 py-12 pb-16 font-mono text-xs text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Contact row — unchanged. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span>{SITE.domain}</span>
          <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">
            {SITE.email}
          </a>
          <a href={`tel:${phoneE164()}`} className="transition-colors hover:text-accent">
            {SITE.phone}
          </a>
          <span>{SITE.location}</span>
        </div>

        {/* Profiles + copyright. These are the same URLs the Person schema
            emits as sameAs; `rel="me"` states the identity claim in the markup
            too, which is the form crawlers and IndieWeb consumers read. */}
        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-6">
            {SOCIALS.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  rel="me noreferrer"
                  target="_blank"
                  className="group inline-flex items-center gap-1.5 uppercase tracking-[0.2em] transition-colors hover:text-accent"
                >
                  {social.label}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <span>&copy; {year}</span>
        </div>
      </div>
    </footer>
  );
}
