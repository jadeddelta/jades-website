import {
    HALF,
    PAGE_PAD,
    ROW_H,
    SIDE,
    cellKey,
    centroidX,
    centroidY,
    isVertex,
    parseCellKey,
    parseVertexKey,
    tilePoints,
    vertexFan,
    verticesOf,
    vertexKey,
} from "./lattice";
import type { Centerline, SectionBox, Tile } from "../types";

/**
 * ceiling on how far the perpendicular correction may widen the band sideways.
 *
 * `inBand` measures distance perpendicular to the center line, which is what
 * makes the trail read as one continuous ribbon instead of a stack of
 * horizontal slices. Converting a horizontal offset into a perpendicular one
 * costs a factor of sqrt(1 + slope^2) in horizontal reach, and that term is
 * unbounded: where the ribbon sweeps across the page the slope peaks near 2.7,
 * a 2.9x stretch. Against the hero's 432px half-width that reaches 1241px to
 * each side of a 1440px page, so a single row spans everything.
 *
 * 1.28 clamps the stretch at the equivalent of a 0.8 slope, roughly 39 degrees
 * off vertical. Past that the band simply stops widening; it leans without
 * spreading. This is the difference between a ribbon and a slab, so do not
 * drop it.
 */
const MAX_SLANT_WIDENING = 1.28;

export interface CarveInput {
    width: number;
    height: number;
    /** bottom of the hero, in document coords; the band behaves differently above it */
    heroEnd: number;
    /** vertical spans, in document coords, where the band may run all the way to both page edges */
    fullWidth?: { top: number; bottom: number }[];
    centerline: Centerline;
    sections: SectionBox[];
}

/**
 * carve the ribbon out of an infinite triangular lattice, done in 5 steps (order matters)
 */
export function carve({ width, height, heroEnd, fullWidth = [], centerline, sections }: CarveInput): Tile[] {
    const { xAt, hwAt } = centerline;

    const rows = Math.ceil(height / ROW_H) + 1;
    const kMin = Math.floor(-340 / HALF);
    const kMax = Math.ceil((width + 60) / HALF);

    const inBounds = (r: number, k: number) => {
        if (r < 0 || r >= rows || k < kMin || k > kMax) return false;
        // in a full-width span, edge to edge (tiles past the edge are clipped by the host)
        const cy = centroidY(r, k);
        if (fullWidth.some((span) => cy >= span.top && cy <= span.bottom)) return true;
        const xl = k * HALF;
        // never cross the right page edge
        if (xl + SIDE > width - PAGE_PAD) return false;
        // ...nor the left, except in the hero, where the ribbon deliberately runs
        // off-screen left
        if (xl < PAGE_PAD && cy > heroEnd) return false;
        return true;
    };

    /**
     * check if a given tile exists within the band envelope, checked against perpendicular
     * distance of cell centroid to center line within local half-width
     */
    const inBand = (r: number, k: number, slack: number) => {
        if (!inBounds(r, k)) return false;
        const cx = centroidX(k);
        const cy = centroidY(r, k);
        const xc = xAt(cy);
        let hw = hwAt(cy) * slack;
        // the hero band gets one extra tile layer, on its right side only
        if (cy <= heroEnd && cx > xc) hw += HALF;
        const slope = (xAt(cy + 12) - xAt(cy - 12)) / 24;
        const dx = Math.abs(cx - xc);
        return dx / Math.sqrt(1 + slope * slope) <= hw && dx <= hw * MAX_SLANT_WIDENING;
    };

    // --- 1. carve -------------------------------------------------------------
    const has = new Set<string>();
    for (let r = 0; r < rows; r++) {
        for (let k = kMin; k <= kMax; k++) {
            if (inBand(r, k, 1)) has.add(cellKey(r, k));
        }
    }

    // --- 2. prune lone horizontal spikes --------------------------------------
    // 4 passes to remove tiles that have no neighbors, to prevent weird
    // spikes from jutting out
    for (let pass = 0; pass < 4; pass++) {
        let cut = false;
        for (const key of Array.from(has)) {
            const { r, k } = parseCellKey(key);
            if (!has.has(cellKey(r, k - 1)) && !has.has(cellKey(r, k + 1))) {
                has.delete(key);
                cut = true;
            }
        }
        if (!cut) break;
    }

    // --- 3. hexagon completion ------------------------------------------------
    // prevents holes by ensuring that all non-4-length lattice vertex groups
    // are formed into hexagons. 4-length is left alone as they've been smoothened
    // out by step 2 and will create slabs of triangles that look funny
    for (let pass = 0; pass < 3; pass++) {
        const vertices = new Set<string>();
        for (const key of has) {
            const { r, k } = parseCellKey(key);
            for (const { m, l } of verticesOf(r, k)) vertices.add(vertexKey(m, l));
        }

        let added = 0;
        for (const vk of vertices) {
            const { m, l } = parseVertexKey(vk);
            if (!isVertex(m, l)) continue;
            const fan = vertexFan(m, l);
            const present = fan.reduce((n, c) => (has.has(cellKey(c.r, c.k)) ? n + 1 : n), 0);
            if (present !== 5) continue;
            for (const { r, k } of fan) {
                const key = cellKey(r, k);
                if (!has.has(key) && inBounds(r, k)) {
                    has.add(key);
                    added++;
                }
            }
        }
        if (!added) break;
    }

    // --- 4. assign ownership and identity -------------------------------------
    const ordered = [...sections].sort((a, b) => a.top - b.top);
    const sectionAt = (cy: number): SectionBox => {
        for (const box of ordered) {
            if (cy < box.top + box.height) return box;
        }
        return ordered[ordered.length - 1];
    };
    /** lattice row the section's top edge falls in, so ids are section-relative */
    const rowZero = new Map<string, number>(ordered.map((b) => [b.id, Math.floor(b.top / ROW_H)]));

    // --- 5. opacity -----------------------------------------------------------
    // cubic falloff: edge tiles will fade towards nothing
    const tiles: Tile[] = [];
    for (const key of has) {
        const { r, k } = parseCellKey(key);
        const cx = centroidX(k);
        const cy = centroidY(r, k);
        const normalized = Math.min(1, Math.abs(cx - xAt(cy)) / Math.max(1, hwAt(cy)));
        const box = sectionAt(cy);
        tiles.push({
            id: `${box.id}:${r - (rowZero.get(box.id) ?? 0)}:${k}`,
            section: box.id,
            r,
            k,
            points: tilePoints(r, k),
            cx,
            cy,
            opacity: 0.05 + 0.48 * (1 - normalized ** 3),
        });
    }

    tiles.sort((a, b) => a.cy - b.cy || a.cx - b.cx);
    return tiles;
}
