'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CAJS, DESKTOP_PROJECTS, type DesktopProject } from '@/content/work';
import { clampToBounds, type Size } from './geometry';
import { FolderIcon } from './FolderIcon';
import { MenuBar } from './MenuBar';
import { ProjectWindow, type WindowContent } from './ProjectWindow';

const FOLDER_SIZE: Size = { width: 112, height: 88 };
// Height is a generous floor used only for drag-clamping so a window can't be
// dragged far enough down to clip its footer (links) past the screen edge.
const WINDOW_SIZE: Size = { width: 480, height: 560 };

interface OpenWindow {
  id: string;
  x: number;
  y: number;
  z: number;
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return mobile;
}

export function Desktop() {
  const t = useTranslations();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Folder positions in px, derived from percentage starts once measured.
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const topZ = useRef(10);
  const dragMoved = useRef(false);

  // Build display-ready content per project (single i18n hub).
  const buildContent = useCallback(
    (p: DesktopProject): WindowContent => {
      const links = (p.links ?? []).map((l) => ({
        label: t(l.labelKey),
        href: l.href,
        external: l.external,
      }));
      if (p.kind === 'case') {
        return {
          id: p.id,
          title: t('work.cajs.title'),
          summary: t('work.cajs.summary'),
          builtTitle: t('work.desktop.builtTitle'),
          built: CAJS.features.map((k) => ({ title: t(`caseCajs.features.${k}.title`) })),
          specsTitle: t('work.desktop.specsTitle'),
          stackTitle: t('work.desktop.stackTitle'),
          stats: [
            { label: t('work.desktop.stat.pages'), value: CAJS.stats.pages },
            { label: t('work.desktop.stat.tests'), value: CAJS.stats.tests },
            { label: t('work.desktop.stat.marketValue'), value: CAJS.stats.marketValue },
            { label: t('work.desktop.stat.effort'), value: CAJS.stats.effort },
          ],
          stack: CAJS.stack,
          links,
          caseHref: `/work/${CAJS.slug}`,
          caseCta: t('work.desktop.caseCta'),
        };
      }
      if (p.kind === 'product') {
        return {
          id: p.id,
          title: t('work.skedio.title'),
          summary: t('work.skedio.summary'),
          links,
        };
      }
      return {
        id: p.id,
        title: t('work.desktop.lockedTitle'),
        summary: '',
        locked: true,
        lockedBody: t('work.desktop.lockedBody'),
      };
    },
    [t],
  );

  const folderLabel = useCallback((p: DesktopProject) => buildContent(p).title, [buildContent]);

  // Convert percentage starts to px once the surface is measured (desktop only).
  useEffect(() => {
    if (isMobile) return;
    const el = surfaceRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    setPositions((prev) => {
      const next = { ...prev };
      for (const p of DESKTOP_PROJECTS) {
        if (next[p.id]) continue;
        next[p.id] = clampToBounds(
          { x: (p.start.x / 100) * rect.width, y: (p.start.y / 100) * rect.height },
          FOLDER_SIZE,
          { width: rect.width, height: rect.height },
        );
      }
      return next;
    });
  }, [isMobile]);

  const bringToFront = useCallback((id: string) => {
    topZ.current += 1;
    const z = topZ.current;
    setOpenWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const openWindow = useCallback((id: string) => {
    setOpenWindows((ws) => {
      const existing = ws.find((w) => w.id === id);
      topZ.current += 1;
      if (existing) return ws.map((w) => (w.id === id ? { ...w, z: topZ.current } : w));
      const offset = ws.length * 22;
      return [...ws, { id, x: 28 + offset, y: 20 + offset, z: topZ.current }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((ws) => ws.filter((w) => w.id !== id));
    // Restore focus to the originating folder.
    requestAnimationFrame(() => {
      const btn = document.querySelector<HTMLButtonElement>(`[data-folder="${id}"]`);
      btn?.focus();
    });
  }, []);

  const activate = useCallback(
    (id: string) => {
      if (dragMoved.current) {
        dragMoved.current = false;
        return;
      }
      openWindow(id);
    },
    [openWindow],
  );

  // Pointer drag for a folder (desktop only). Enhancement — never required.
  const startFolderDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (isMobile) return;
      const surface = surfaceRef.current;
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      const start = positions[id] ?? { x: 0, y: 0 };
      const originX = e.clientX;
      const originY = e.clientY;
      dragMoved.current = false;
      setDraggingId(id);

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - originX;
        const dy = ev.clientY - originY;
        if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved.current = true;
        setPositions((prev) => ({
          ...prev,
          [id]: clampToBounds(
            { x: start.x + dx, y: start.y + dy },
            FOLDER_SIZE,
            { width: rect.width, height: rect.height },
          ),
        }));
      };
      const up = () => {
        setDraggingId(null);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        // Clear the drag flag after the synthetic click has had its chance to
        // read it (rAF fires after the click), so it never persists stale.
        requestAnimationFrame(() => {
          dragMoved.current = false;
        });
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [isMobile, positions],
  );

  // Pointer drag for a window title bar (desktop only).
  const startWindowDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (isMobile) return;
      const surface = surfaceRef.current;
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      const win = openWindows.find((w) => w.id === id);
      if (!win) return;
      bringToFront(id);
      const originX = e.clientX;
      const originY = e.clientY;
      const startX = win.x;
      const startY = win.y;

      const move = (ev: PointerEvent) => {
        setOpenWindows((ws) =>
          ws.map((w) =>
            w.id === id
              ? {
                  ...w,
                  ...clampToBounds(
                    { x: startX + (ev.clientX - originX), y: startY + (ev.clientY - originY) },
                    WINDOW_SIZE,
                    { width: rect.width, height: rect.height },
                  ),
                }
              : w,
          ),
        );
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [isMobile, openWindows, bringToFront],
  );

  return (
    <section
      id="work"
      aria-label={t('sections.work')}
      className="relative w-full px-4 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Label above the screen so the frame reads as a discrete object. */}
        <div className="mb-4 px-1 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          02 — {t('sections.work')}
        </div>

        {/* The screen: a bounded, lit monitor panel sitting on the page. */}
        <div className="relative flex h-[88vh] min-h-[600px] flex-col overflow-hidden rounded-xl border border-line bg-black/20 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
          {/* Bezel top-light + inner vignette so it reads as a lit display. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-xl shadow-[inset_0_1px_0_rgba(233,225,214,0.06),inset_0_0_160px_rgba(0,0,0,0.55)]"
          />
          {/* Faint warm glow from the top edge. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(85% 55% at 50% -12%, rgba(232,176,75,0.06), transparent 62%)',
            }}
          />

          {/* Top chrome */}
          <MenuBar brand={t('work.desktop.menuBrand')} />

          {/* Desktop surface — folders and windows live inside the screen. */}
          <div
            ref={surfaceRef}
            className={`relative flex-1 ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}
          >
            {/* Screen surface texture — reads as a live CRT/computer display.
                Sits behind folders/windows so content stays crisp. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* Phosphor glow — a display emits brightest at its centre. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(120% 90% at 50% 42%, rgba(232,176,75,0.055), transparent 60%)',
                }}
              />
              {/* Faint workspace grid. */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(233,225,214,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(233,225,214,0.022) 1px, transparent 1px)',
                  backgroundSize: '46px 46px',
                }}
              />
              {/* Ghosted brand watermark. */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="select-none font-display text-[12vw] leading-none text-fg/[0.03]">
                  {t('work.desktop.menuBrand')}
                </span>
              </div>
              {/* CRT scanlines. */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
                }}
              />
              {/* Slow refresh sweep. */}
              <div className="crt-sweep absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[rgba(233,225,214,0.05)] to-transparent" />
            </div>

            {isMobile ? (
              // Mobile: static tappable grid.
              <div className="grid grid-cols-2 gap-4 p-6">
                {DESKTOP_PROJECTS.map((p) => (
                  <FolderIcon
                    key={p.id}
                    id={p.id}
                    label={folderLabel(p)}
                    locked={p.kind === 'locked'}
                    onActivate={activate}
                  />
                ))}
              </div>
            ) : (
              // Desktop: absolutely-positioned draggable folders.
              DESKTOP_PROJECTS.map((p) => {
                const pos = positions[p.id];
                return (
                  <FolderIcon
                    key={p.id}
                    id={p.id}
                    label={folderLabel(p)}
                    locked={p.kind === 'locked'}
                    x={pos?.x}
                    y={pos?.y}
                    dragging={draggingId === p.id}
                    onActivate={activate}
                    onPointerDown={startFolderDrag}
                  />
                );
              })
            )}

            {/* Open windows */}
            {openWindows.map((w) => {
              const project = DESKTOP_PROJECTS.find((p) => p.id === w.id);
              if (!project) return null;
              return (
                <ProjectWindow
                  key={w.id}
                  content={buildContent(project)}
                  mode={isMobile ? 'sheet' : 'window'}
                  x={w.x}
                  y={w.y}
                  z={w.z}
                  onClose={closeWindow}
                  onFocus={bringToFront}
                  onTitlePointerDown={startWindowDrag}
                />
              );
            })}
          </div>

          {/* Bottom status strip — language-neutral, sells the "screen". */}
          <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[0.65rem] tracking-[0.25em] text-muted">
            <span className="flex items-center gap-1.5">
              {DESKTOP_PROJECTS.map((p) => (
                <span
                  key={p.id}
                  aria-hidden="true"
                  className={p.kind === 'locked' ? 'text-muted/40' : 'text-accent'}
                >
                  ▪
                </span>
              ))}
              <span className="ml-2 tabular-nums">{DESKTOP_PROJECTS.length}</span>
            </span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
