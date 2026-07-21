'use client';

import { BOOT_LINES, type BootState } from '@/components/webgl/bootLines';

/**
 * DOM/CSS stand-in for the 3D boot scene, shown on phones and low-end devices.
 *
 * Same choreography as BootScene — same phases, same lines, same timing, driven
 * by the same BootState — but drawn with HTML and CSS instead of a WebGL canvas
 * texture on a GLTF model. That's the whole point: three.js is ~364 KB
 * compressed and 1.16 MB to parse, which on a mid-range Android costs seconds
 * of blocked main thread for an intro. This costs nothing measurable.
 *
 * Visual language deliberately mirrors `drawScreen()`: off-black warm tube,
 * amber phosphor text, scanlines, vignette, and a power-on band.
 */
export function BootScreen({ boot }: { boot: BootState }) {
  const lines = BOOT_LINES.slice(0, boot.visibleLines);
  const showLog = boot.phase === 'log' || boot.phase === 'enter' || boot.phase === 'exit';

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* The tube. Aspect-matched to the 640x480 canvas the 3D scene draws. */}
      <div
        className="relative aspect-[4/3] w-[86%] max-w-[34rem] overflow-hidden rounded-sm"
        style={{ background: '#070502' }}
      >
        {/* Power-on: a bright band sweeping the tube. */}
        {boot.phase === 'power' && (
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-[19%] -translate-y-1/2"
            style={{ background: 'rgba(240,188,87,0.85)' }}
          />
        )}

        {/* Boot log. */}
        {showLog && (
          <div
            className="absolute inset-0 px-[8%] py-[9%] font-mono leading-[1.45] text-[clamp(0.7rem,3.1vw,1rem)]"
            style={{ color: '#F0BC57' }}
          >
            {lines.map((line) => (
              <div key={line}>
                {line}
                {line === 'READY' && (
                  <span
                    aria-hidden
                    className="ml-2 inline-block h-[1em] w-[0.55em] translate-y-[0.12em] bg-[#F0BC57] motion-safe:animate-pulse"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scanlines — the 3px cadence the canvas version draws. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Screen vignette. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 15%, rgba(0,0,0,0.55) 78%)',
          }}
        />

        {/* Enter: the tube flares out, standing in for the 3D glitch. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#F0BC57] transition-opacity duration-1000 ease-in motion-reduce:transition-none"
          style={{ opacity: boot.phase === 'enter' ? 0.55 : 0 }}
        />
      </div>
    </div>
  );
}
