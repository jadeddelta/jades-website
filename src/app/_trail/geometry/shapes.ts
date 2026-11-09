import { HALF, ROW_H, cellKey, centroidX, centroidY, vertexKey, verticesOf } from "./lattice";
import type { Vertex } from "./lattice";
import type { Cell } from "../types";

/*
 * shapes built from whole lattice cells: hexagons, unions of hexagons, their
 * outlines, and boxes that fit inside them. used by anything that sits on the
 * trail's grid (the projects page's stones and display).
 */

/** a point in document px */
export type Point = [x: number, y: number];

/** a rectangle in document px */
export interface Box {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export const vertexPoint = ({ m, l }: Vertex): Point => [m * HALF, l * ROW_H];
export const cellCorners = ({ r, k }: Cell): Point[] => verticesOf(r, k).map(vertexPoint);
export const cellCenter = ({ r, k }: Cell): Point => [centroidX(k), centroidY(r, k)];

/**
 * the six cells around vertex (m, l), clockwise from the one straight above:
 * top, top-right, bottom-right, bottom, bottom-left, top-left
 */
export function hexCells(m: number, l: number): Cell[] {
    return [
        { r: l - 1, k: m - 1 },
        { r: l - 1, k: m },
        { r: l, k: m },
        { r: l, k: m - 1 },
        { r: l, k: m - 2 },
        { r: l - 1, k: m - 2 },
    ];
}

/** every cell of the hexagons around these vertices, each once */
export function hexUnion(centers: Vertex[]): Cell[] {
    const cells = new Map<string, Cell>();
    for (const { m, l } of centers) for (const cell of hexCells(m, l)) cells.set(cellKey(cell.r, cell.k), cell);
    return [...cells.values()];
}

/** the boundary of a set of cells, as closed loops of corner points (straight runs merged) */
export function outline(cells: Cell[]): Point[][] {
    const edgeKey = (a: string, b: string) => (a < b ? `${a}/${b}` : `${b}/${a}`);

    // an edge used by one cell is on the boundary; an edge shared by two is inside
    const uses = new Map<string, number>();
    for (const { r, k } of cells) {
        const [a, b, c] = verticesOf(r, k).map((v) => vertexKey(v.m, v.l));
        for (const key of [edgeKey(a, b), edgeKey(b, c), edgeKey(c, a)]) uses.set(key, (uses.get(key) ?? 0) + 1);
    }
    const next = new Map<string, string[]>();
    for (const [key, n] of uses) {
        if (n !== 1) continue;
        const [a, b] = key.split("/");
        next.set(a, [...(next.get(a) ?? []), b]);
        next.set(b, [...(next.get(b) ?? []), a]);
    }

    // walk each loop of boundary edges
    const walked = new Set<string>();
    const loops: Point[][] = [];
    for (const start of next.keys()) {
        for (const first of next.get(start)!) {
            if (walked.has(edgeKey(start, first))) continue;
            walked.add(edgeKey(start, first));
            const loop = [start];
            let at = first;
            while (at !== start) {
                loop.push(at);
                const step = next.get(at)!.find((n) => !walked.has(edgeKey(at, n)));
                if (!step) break;
                walked.add(edgeKey(at, step));
                at = step;
            }
            const points = loop.map((key) => {
                const [m, l] = key.split("|").map(Number);
                return vertexPoint({ m, l });
            });
            // drop corners that sit on a straight line
            loops.push(
                points.filter((p, i) => {
                    const a = points[(i - 1 + points.length) % points.length];
                    const b = points[(i + 1) % points.length];
                    return Math.abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) > 0.01;
                }),
            );
        }
    }
    return loops;
}

/** an svg path `d` for outline loops */
export const pathD = (loops: Point[][]) =>
    loops.map((loop) => "M" + loop.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z").join(" ");

/** where a set of cells starts and ends along the line y, for the run that contains refX */
export function spanAt(cells: Cell[], y: number, refX: number): [number, number] {
    const runs: [number, number][] = [];
    for (const cell of cells) {
        const corners = cellCorners(cell);
        const ys = corners.map((c) => c[1]);
        if (y < Math.min(...ys) - 0.01 || y > Math.max(...ys) + 0.01) continue;
        const xs: number[] = [];
        for (let i = 0; i < 3; i++) {
            const [ax, ay] = corners[i];
            const [bx, by] = corners[(i + 1) % 3];
            if ((ay - y) * (by - y) > 0 || ay === by) continue;
            xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
        }
        if (xs.length) runs.push([Math.min(...xs), Math.max(...xs)]);
    }
    runs.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const run of runs) {
        const last = merged[merged.length - 1];
        if (last && run[0] <= last[1] + 0.5) last[1] = Math.max(last[1], run[1]);
        else merged.push([...run]);
    }
    return merged.find(([l, r]) => l <= refX && refX <= r) ?? [refX, refX];
}

/** the widest box between `top` and `bottom` that stays inside the cells (sloped edges included), less `pad` each side */
export function fitBox(cells: Cell[], top: number, bottom: number, refX: number, pad = 18): Box {
    let left = -Infinity;
    let right = Infinity;
    for (let i = 0; i <= 12; i++) {
        const [l, r] = spanAt(cells, top + ((bottom - top) * i) / 12, refX);
        left = Math.max(left, l);
        right = Math.min(right, r);
    }
    return { left: left + pad, right: right - pad, top, bottom };
}

/** the horizontal middle of a set of cells */
export function midX(cells: Cell[]): number {
    const xs = cells.flatMap((cell) => cellCorners(cell).map((c) => c[0]));
    return (Math.min(...xs) + Math.max(...xs)) / 2;
}
