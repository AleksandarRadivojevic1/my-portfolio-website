import { ImageResponse } from 'next/og';
import { SITE } from '@/content/site';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// The site's own palette (app/globals.css @theme). The first version of the
// homepage card used a lime accent left over from an earlier design direction,
// which meant every share looked like a different brand than the site.
const BG = '#0A0805';
const FG = '#D9D7D4';
const MUTED = '#7F796E';
const AMBER = '#E8B04B';

type OgCardProps = {
  /** Small uppercase line above the title — section or content type. */
  eyebrow: string;
  title: string;
  subtitle: string;
};

/**
 * Shared OG card for every route that renders one.
 *
 * Deliberately no custom font loading: ImageResponse's font pipeline (satori)
 * needs a raw font buffer fetched at build time, which is an easy way to break
 * `npm run build` on a network hiccup. The default font is self-contained and
 * good enough at this size.
 */
export function renderOgCard({ eyebrow, title, subtitle }: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: BG,
          color: FG,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: AMBER,
          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: MUTED }}>{subtitle}</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 24,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: MUTED,
          }}
        >
          <span>{SITE.domain}</span>
          <span>{SITE.location}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
