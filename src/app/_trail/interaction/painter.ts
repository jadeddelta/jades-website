import { JADE_BRIGHT, JADE_RGB } from "../theme";
import type { Tile, TileId } from "../types";

/**
 * handles all style writes to the mesh polygon, for now, hover and click pulses.
 * nothing touches react, we rerender through the DOM to avoid touching it at
 * 60fps.
 */

/** how fast the pulse front travels outward, px per ms */
const PULSE_SPEED = 0.95;
/** how far either side of the front a tile still lights up, px */
const PULSE_BAND = 130;

export interface Painter {
    setHot: (tile: Tile | null) => void;
    /** send a ring expanding outward from a point in document coordinates */
    pulseFrom: (x: number, y: number) => void;
    dispose: () => void;
}

export interface PainterOptions {
    tiles: () => Tile[];
    elementFor: (id: TileId) => SVGPolygonElement | undefined;
}

/** a tile and its distance from the pulse origin */
interface RingEntry {
    id: TileId;
    d: number;
}

interface Pulse {
    start: number;
    /** every tile, sorted by nearest to origin */
    ring: RingEntry[];
    /** index of the first tile the trailing edge has not yet released */
    tail: number;
}

const rest = (el: SVGPolygonElement) => {
    el.style.fill = "";
    el.style.opacity = "";
    el.style.filter = "";
    el.style.stroke = "";
};

const paintHot = (el: SVGPolygonElement) => {
    el.style.fill = `rgba(${JADE_RGB},.30)`;
    el.style.opacity = "1";
    el.style.filter = `drop-shadow(0 0 12px rgba(${JADE_RGB},.95))`;
};

const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function createPainter({ tiles, elementFor }: PainterOptions): Painter {
    let hot: TileId | null = null;
    const lit = new Set<TileId>();
    let frame: number | null = null;
    let pulse: Pulse | null = null;

    const setHot = (tile: Tile | null) => {
        const next = tile?.id ?? null;
        if (next === hot) return;
        if (hot !== null && !lit.has(hot)) {
            const previous = elementFor(hot);
            if (previous) rest(previous);
        }
        hot = next;
        if (next === null) return;
        const el = elementFor(next);
        if (el) paintHot(el);
    };

    /** hand a tile back to whatever state it should hold once the ring passes */
    const release = (id: TileId) => {
        lit.delete(id);
        const el = elementFor(id);
        if (!el) return;
        if (id === hot) paintHot(el);
        else rest(el);
    };

    /** to be fed into rAF */
    const step = (now: number) => {
        frame = null;
        if (!pulse) return;

        const front = (now - pulse.start) * PULSE_SPEED;
        const inner = front - PULSE_BAND;
        const outer = front + PULSE_BAND;
        const { ring } = pulse;

        // lit annulus is a contiguous window of `ring`: so we walk forward and repaint
        // the window the leading edge has reached w/out scanning the full mesh per frame
        while (pulse.tail < ring.length && ring[pulse.tail].d < inner) {
            release(ring[pulse.tail].id);
            pulse.tail++;
        }

        for (let i = pulse.tail; i < ring.length && ring[i].d <= outer; i++) {
            const { id, d } = ring[i];
            const el = elementFor(id);
            if (!el) continue;
            const k = 1 - Math.abs(d - front) / PULSE_BAND;
            el.style.stroke = JADE_BRIGHT;
            el.style.fill = `rgba(${JADE_RGB},${(0.4 * k).toFixed(3)})`;
            el.style.opacity = String(Math.min(1, 0.35 + 0.65 * k));
            el.style.filter = `drop-shadow(0 0 ${(14 * k).toFixed(1)}px rgba(${JADE_RGB},.9))`;
            lit.add(id);
        }

        if (pulse.tail < ring.length) {
            frame = requestAnimationFrame(step);
            return;
        }
        pulse = null;
    };

    const pulseFrom = (x: number, y: number) => {
        if (prefersReducedMotion()) return;

        const ring: RingEntry[] = tiles().map((tile) => ({
            id: tile.id,
            d: Math.hypot(tile.cx - x, tile.cy - y),
        }));
        ring.sort((a, b) => a.d - b.d);

        // a new click restarts the ring: release whatever the last one left lit
        for (const id of [...lit]) release(id);

        pulse = { start: performance.now(), ring, tail: 0 };
        if (frame === null) frame = requestAnimationFrame(step);
    };

    const dispose = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        pulse = null;
        for (const id of [...lit]) release(id);
        hot = null;
    };

    return { setHot, pulseFrom, dispose };
}
