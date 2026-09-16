"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import TrailCanvas from './TrailCanvas';
import { buildCenterline } from './geometry/centerline';
import { carve } from './geometry/carve';
import { HERO_SECTION, buildRoute } from './geometry/route';
import { createHitIndex } from './interaction/hitTest';
import { createPainter } from './interaction/painter';
import { SECTION_IDS } from '../_sections/sections';
import type { HitIndex } from './interaction/hitTest';
import type { Painter } from './interaction/painter';
import type { NeonLevel } from './theme';
import type { SectionBox, TileId, TrailGeometry } from './types';


export interface TrianglePathProps {
  neon?: NeonLevel
  dotOpacity?: number
  dotSize?: number
  dotSpacing?: number
  showDots?: boolean
}

const EMPTY: TrailGeometry = { tiles: [], width: 0, height: 0, ribbon: '' };

/**
 * determine if a target is an controllable page element (button, link, etc..)
 * such that we can prevent the tiles underneath from lighting up. 
 * we also add an opt-out attribute `data-trail-anchor` for elements that 
 * will act as buttons on the page trail.
 */
const isPageControl = (target: Element | null) => {
  const control = target?.closest?.('a, button, [role="button"], input, textarea, select');
  return !!control && !control.hasAttribute('data-trail-anchor');
};

/**
 * the winding tiled-triangle trail and the masked dot field
 * 
 * IMPORTANT: mount as first child of scroll container, which much have 
 * `position: relative`. 
 * 
 * it measures sections listed in `SECTION_IDS` by id against container, routes 
 * the ribbon through them (see `geometry/route.ts`) and carves a triangular 
 * lattice down to that ribbon (see `geometry/carve.ts`). only handles
 * measurement and event wiring only, geometry lives in `geometry/`, the 
 * glow is handled by `interaction/painter.ts`, and drawing in `TrailCanvas`.
 */
export default function TrianglePath({
  neon = 'subtle',
  dotOpacity = 0.9,
  dotSize = 1,
  dotSpacing = 64,
  showDots = true,
}: TrianglePathProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<TrailGeometry>(EMPTY);

  // mirrors of state that the event handlers read: handlers are installed
  // once and must not be torn down and reattached on every rebuild.
  const geometryRef = useRef<TrailGeometry>(EMPTY);
  const hitIndexRef = useRef<HitIndex | null>(null);
  const elements = useRef(new Map<TileId, SVGPolygonElement>());

  const registerTile = useCallback((id: TileId, el: SVGPolygonElement | null) => {
    if (el) elements.current.set(id, el);
    else elements.current.delete(id);
  }, []);

  useEffect(() => {
    const root = hostRef.current?.parentElement;
    if (!root) return;

    const painter: Painter = createPainter({
      tiles: () => geometryRef.current.tiles,
      elementFor: (id) => elements.current.get(id),
    });

    const rebuild = () => {
      const width = root.clientWidth;
      const height = root.scrollHeight;
      if (!width || !height) return;

      const rootBox = root.getBoundingClientRect();
      const sections: SectionBox[] = [];
      let heroEnd = 0;

      for (const id of SECTION_IDS) {
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (!el) continue;
        const box = el.getBoundingClientRect();
        const top = box.top - rootBox.top;
        sections.push({ id, top, height: box.height });
        if (id === HERO_SECTION) heroEnd = top + box.height;
      }
      if (!sections.length) return;

      const centerline = buildCenterline(sections, buildRoute(width), width, height);
      if (!centerline) return;

      const tiles = carve({ width, height, heroEnd, centerline, sections });
      const next: TrailGeometry = { tiles, width, height, ribbon: centerline.outline(height) };

      geometryRef.current = next;
      hitIndexRef.current = createHitIndex(tiles);
      setGeometry(next);
    };

    // a carve is O(rows x columns) and allocates the whole mesh. anything that
    // animates height — an accordion opening, say — fires the observer every
    // frame, so coalesce into one rebuild per frame.
    let rebuildFrame: number | null = null;
    const scheduleRebuild = () => {
      if (rebuildFrame !== null) return;
      rebuildFrame = requestAnimationFrame(() => {
        rebuildFrame = null;
        rebuild();
      });
    };

    // immediately rebuild once instead of waiting for the next frame, so it doesn't
    // flash an empty frame at the start
    rebuild();

    const observer = new ResizeObserver(scheduleRebuild);
    observer.observe(root);

    // ensure path is rebuilt when fonts are finished up
    document.fonts?.ready.then(scheduleRebuild).catch(() => {});

    const toLocal = (e: MouseEvent) => {
      const box = root.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };

    // moves limited to once per frame, newest event kept so the glow doesn't
    // lag behind the cursor or light a tile the pointer has left already
    let latestMove: MouseEvent | null = null;
    let moveQueued = false;
    const onMove = (e: MouseEvent) => {
      latestMove = e;
      if (moveQueued) return;
      moveQueued = true;
      requestAnimationFrame(() => {
        moveQueued = false;
        const move = latestMove;
        latestMove = null;
        if (!move) return;
        // over a control, the mesh goes dark instead of tracking the cursor
        if (isPageControl(move.target as Element | null)) {
          painter.setHot(null);
          return;
        }
        const point = toLocal(move);
        painter.setHot(hitIndexRef.current?.nearest(point.x, point.y) ?? null);
      });
    };

    const onLeave = () => painter.setHot(null);

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      // real controls win, and a click that ends a text selection is not a
      // request to set the whole page pulsing
      if (isPageControl(target)) return;
      if (window.getSelection()?.toString()) return;

      const point = toLocal(e);
      const tile = hitIndexRef.current?.nearest(point.x, point.y);
      if (!tile) return;
      painter.pulseFrom(tile.cx, tile.cy);
    };

    root.addEventListener('mousemove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    root.addEventListener('click', onClick);

    return () => {
      observer.disconnect();
      if (rebuildFrame !== null) cancelAnimationFrame(rebuildFrame);
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      root.removeEventListener('click', onClick);
      painter.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      // z-index 0 keeps this behind the page content, which sits at z-10.
      // Without it an absolutely positioned element paints above its
      // in-flow siblings and the vignette tints the text it covers.
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <TrailCanvas
        geometry={geometry}
        neon={neon}
        showDots={showDots}
        dotOpacity={dotOpacity}
        dotSize={dotSize}
        dotSpacing={dotSpacing}
        registerTile={registerTile}
      />
    </div>
  );
}
