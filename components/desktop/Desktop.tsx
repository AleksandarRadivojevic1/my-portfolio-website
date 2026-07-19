'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CAJS, DESKTOP_PROJECTS, type DesktopProject } from '@/content/work';
import { clampToBounds, type Size } from './geometry';
import { FolderIcon } from './FolderIcon';
import { MenuBar } from './MenuBar';
import { ProjectWindow, type WindowContent } from './ProjectWindow';

const FOLDER_SIZE: Size = { width: 112, height: 88 };
const WINDOW_SIZE: Size = { width: 512, height: 480 };

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
      const offset = ws.length * 24;
      return [...ws, { id, x: 120 + offset, y: 96 + offset, z: topZ.current }];
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
      className="relative min-h-[90vh] w-full overflow-hidden px-4 py-10"
    >
      {!isMobile && <MenuBar brand={t('work.desktop.menuBrand')} />}

      {/* Ghosted background type — the "wallpaper" over the Atmosphere layer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="select-none font-display text-[18vw] leading-none text-fg/[0.03]">
          {t('work.desktop.menuBrand')}
        </span>
      </div>

      <div className="mb-6 px-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        03 — {t('sections.work')}
      </div>

      {isMobile ? (
        // Mobile: static tappable grid.
        <div className="grid grid-cols-2 gap-4">
          {DESKTOP_PROJECTS.map((p) => (
            <FolderIcon key={p.id} id={p.id} label={folderLabel(p)} locked={p.kind === 'locked'} onActivate={activate} />
          ))}
        </div>
      ) : (
        // Desktop: absolutely-positioned draggable folders.
        <div ref={surfaceRef} className="relative h-[70vh] w-full">
          {DESKTOP_PROJECTS.map((p) => {
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
          })}
        </div>
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
    </section>
  );
}
