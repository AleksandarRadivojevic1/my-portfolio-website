// Fixed, behind everything: turns the flat black into a living, warm dark.
// Warm depth glow + vignette for light, animated film grain for life, and a
// faint scanline whisper that ties the whole surface to the CRT boot world.
// Purely decorative; pointer-events-none; grain animation respects reduced motion.

import { GRAIN_URL as GRAIN } from './grain';

export function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Warm light source from above + vignette for depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 80% at 50% -8%, rgba(232,176,75,0.07), rgba(10,8,5,0) 52%), radial-gradient(120% 120% at 50% 45%, rgba(10,8,5,0) 42%, rgba(0,0,0,0.55))',
        }}
      />
      {/* Film grain — oversized so the jitter never exposes an edge. */}
      <div
        className="grain absolute -inset-1/2 h-[200%] w-[200%] opacity-[0.055] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '170px 170px' }}
      />
      {/* Faint CRT scanlines across the whole surface. */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(233,225,214,0.6) 0, rgba(233,225,214,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />
    </div>
  );
}
