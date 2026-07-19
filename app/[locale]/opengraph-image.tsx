import { ImageResponse } from 'next/og';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { SITE } from '@/content/site';

export const alt = `${SITE.name} — Full-Stack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Deliberately no custom font loading here: ImageResponse's font pipeline
// (satori) needs a raw font buffer fetched at build time, which is an easy
// way to break `npm run build` on a network hiccup. The system/default
// font is self-contained and good enough for an OG card.
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  const role = locale === 'sr' ? 'Full-Stack Programer · Leskovac, RS' : 'Full-Stack Developer · Leskovac, RS';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 24,
          padding: '80px 96px',
          background: '#0A0A0B',
          color: '#F5F5F5',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#C6FF4A',
          }}
        >
          {SITE.domain}
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          {SITE.name}
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#B5B5B8' }}>{role}</div>
      </div>
    ),
    { ...size }
  );
}
