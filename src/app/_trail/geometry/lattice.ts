import type { Cell, CellKey } from "../types";

/** triangle side length in px */
export const SIDE = 98;
/** lattice row height  (the altitude of an equilateral triangle of side SIDE) */
export const ROW_H = (SIDE * Math.sqrt(3)) / 2;
export const HALF = SIDE / 2;
/** padding for the mesh off the sides (discounting the entrance which will be left on main) */
export const PAGE_PAD = 44;

/** positive modulo, so negative columns behave. */
const pmod = (n: number) => ((n % 2) + 2) % 2;

/** returns if a cell is pointing up (true) or down (false), based on coords */
export const isUp = (r: number, k: number) => pmod(k + r) === 0;

/* calculations for cell centroids */
export const centroidX = (k: number) => k * HALF + SIDE / 2;
export const centroidY = (r: number, k: number) => (isUp(r, k) ? r * ROW_H + (ROW_H * 2) / 3 : r * ROW_H + ROW_H / 3);

/* cell key conversions */
export const cellKey = (r: number, k: number): CellKey => `${r}:${k}`;
export const parseCellKey = (key: CellKey): Cell => {
    const [r, k] = key.split(":").map(Number);
    return { r, k };
};

/** `points` attribute for a cell's <polygon>, in document coordinates. */
export function tilePoints(r: number, k: number): string {
    const y0 = r * ROW_H;
    const y1 = y0 + ROW_H;
    const xl = k * HALF;
    return isUp(r, k)
        ? `${xl},${y1} ${xl + SIDE},${y1} ${xl + SIDE / 2},${y0}`
        : `${xl},${y0} ${xl + SIDE},${y0} ${xl + SIDE / 2},${y1}`;
}

/** lattice vertex (m, l): 6 triangles meet at every vertex where m+l is odd + even (m,l) are not vertices */
export interface Vertex {
    m: number;
    l: number;
}

/* vertex key conversions */
export const vertexKey = (m: number, l: number) => `${m}|${l}`;
export const parseVertexKey = (key: string): Vertex => {
    const [m, l] = key.split("|").map(Number);
    return { m, l };
};

export const isVertex = (m: number, l: number) => pmod(m + l) !== 0;

/** returns the three vertices a cell touches */
export function verticesOf(r: number, k: number): Vertex[] {
    return isUp(r, k)
        ? [
              { m: k + 1, l: r },
              { m: k, l: r + 1 },
              { m: k + 2, l: r + 1 },
          ]
        : [
              { m: k, l: r },
              { m: k + 2, l: r },
              { m: k + 1, l: r + 1 },
          ];
}

/** returns the six cells a vertex touches */
export function vertexFan(m: number, l: number): Cell[] {
    return [
        { r: l, k: m - 1 },
        { r: l - 1, k: m },
        { r: l - 1, k: m - 2 },
        { r: l, k: m },
        { r: l, k: m - 2 },
        { r: l - 1, k: m - 1 },
    ];
}
