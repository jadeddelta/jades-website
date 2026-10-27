"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TrailCanvas from "./TrailCanvas";
import { buildCenterline } from "./geometry/centerline";
import { carve } from "./geometry/carve";
import { createHitIndex } from "./interaction/hitTest";
import { createPainter } from "./interaction/painter";
import { PULSE_EVENT, REMEASURE_EVENT } from "./events";
import type { PulseDetail } from "./events";
import type { HitIndex } from "./interaction/hitTest";
import type { Painter } from "./interaction/painter";
import type { NeonLevel } from "./theme";
import type { SectionBox, TileId, TrailGeometry, TrailRoute } from "./types";

export interface TrianglePathProps {
    /**
     * section ids in document order; each is measured by id on the page.
     * Pass a stable reference such as a module constant: the setup effect
     * depends on it, so a fresh array every render would tear down and rebuild
     * the whole trail. The same goes for `buildRoute`.
     */
    sectionIds: readonly string[];
    /** the page's route through those sections, resolved against page width (and, if it needs them, the sections as measured) */
    buildRoute: (pageWidth: number, sections: SectionBox[]) => TrailRoute;
    /** section that runs off-screen left and wears an extra tile layer */
    heroSection?: string;
    /** sections where the trail may run to both page edges */
    fullWidthSections?: readonly string[];
    neon?: NeonLevel;
    dotOpacity?: number;
    dotSize?: number;
    dotSpacing?: number;
    showDots?: boolean;
}

const EMPTY: TrailGeometry = { tiles: [], width: 0, height: 0, ribbon: "" };

/**
 * determine if a target is an controllable page element (button, link, etc..)
 * such that we can prevent the tiles underneath from lighting up.
 * we also add an opt-out attribute `data-trail-anchor` for elements that
 * will act as buttons on the page trail.
 */
const isPageControl = (target: Element | null) => {
    const control = target?.closest?.('a, button, [role="button"], input, textarea, select');
    return !!control && !control.hasAttribute("data-trail-anchor");
};

/**
 * the winding tiled-triangle trail and the masked dot field
 *
 * IMPORTANT: mount as first child of scroll container, which must have
 * `position: relative`.
 *
 * it measures sections in its `sectionIds` prop by id against container, routes
 * the ribbon through them (the page's `buildRoute`, from its file in `_pages/`) and carves a triangular
 * lattice down to that ribbon (see `geometry/carve.ts`). only handles
 * measurement and event wiring only, geometry lives in `geometry/`, the
 * glow is handled by `interaction/painter.ts`, and drawing in `TrailCanvas`.
 */
export default function TrianglePath({
    sectionIds,
    buildRoute,
    heroSection,
    fullWidthSections,
    neon = "subtle",
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

        // ids already reported missing, so a resize does not repeat the warning
        const warnedMissing = new Set<string>();

        const rebuild = () => {
            const width = root.clientWidth;
            const height = root.scrollHeight;
            if (!width || !height) return;

            const rootBox = root.getBoundingClientRect();
            const sections: SectionBox[] = [];
            let heroEnd = 0;
            const fullWidth: { top: number; bottom: number }[] = [];

            for (const id of sectionIds) {
                // by id rather than CSS selector, so ids never need escaping
                const el = document.getElementById(id);
                if (!el || !root.contains(el)) {
                    // a missing section silently drops its stretch of ribbon, so say
                    // so once per id in development
                    if (process.env.NODE_ENV !== "production" && !warnedMissing.has(id)) {
                        warnedMissing.add(id);
                        console.warn(
                            `[trail] no element with id "${id}" on this page; its stretch of trail is skipped`,
                        );
                    }
                    continue;
                }
                const box = el.getBoundingClientRect();
                const top = box.top - rootBox.top;
                sections.push({ id, top, height: box.height });
                if (id === heroSection) heroEnd = top + box.height;
                if (fullWidthSections?.includes(id)) fullWidth.push({ top, bottom: top + box.height });
            }
            if (!sections.length) return;

            const centerline = buildCenterline(sections, buildRoute(width, sections), sectionIds, width, height);
            if (!centerline) return;

            const tiles = carve({ width, height, heroEnd, fullWidth, centerline, sections });
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

        // ensure path is rebuilt when fonts are finished up, unless we've unmounted by then
        let disposed = false;
        document.fonts?.ready
            .then(() => {
                if (!disposed) scheduleRebuild();
            })
            .catch(() => {});

        const toLocal = (e: MouseEvent) => {
            const box = root.getBoundingClientRect();
            return { x: e.clientX - box.left, y: e.clientY - box.top };
        };

        // moves limited to once per frame, newest event kept so the glow doesn't
        // lag behind the cursor or light a tile the pointer has left already
        let latestMove: MouseEvent | null = null;
        let moveFrame: number | null = null;
        const onMove = (e: MouseEvent) => {
            latestMove = e;
            if (moveFrame !== null) return;
            moveFrame = requestAnimationFrame(() => {
                moveFrame = null;
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

        // the page can ring the trail (a project opening) or have it measure again (see ./events)
        const onPulse = (e: Event) => {
            const { x, y, rgb } = (e as CustomEvent<PulseDetail>).detail;
            painter.pulseFrom(x, y, rgb);
        };

        root.addEventListener("mousemove", onMove, { passive: true });
        root.addEventListener("mouseleave", onLeave);
        root.addEventListener("click", onClick);
        window.addEventListener(PULSE_EVENT, onPulse);
        window.addEventListener(REMEASURE_EVENT, scheduleRebuild);

        return () => {
            disposed = true;
            observer.disconnect();
            if (rebuildFrame !== null) cancelAnimationFrame(rebuildFrame);
            if (moveFrame !== null) cancelAnimationFrame(moveFrame);
            root.removeEventListener("mousemove", onMove);
            root.removeEventListener("mouseleave", onLeave);
            root.removeEventListener("click", onClick);
            window.removeEventListener(PULSE_EVENT, onPulse);
            window.removeEventListener(REMEASURE_EVENT, scheduleRebuild);
            painter.dispose();
        };
    }, [sectionIds, buildRoute, heroSection, fullWidthSections]);

    return (
        <div
            ref={hostRef}
            aria-hidden
            // z-index 0 keeps this behind the page content, which sits at z-10.
            // Without it an absolutely positioned element paints above its
            // in-flow siblings and the vignette tints the text it covers.
            style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
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
