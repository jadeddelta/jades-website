import { HALF, ROW_H, SIDE, isUp, isVertex } from "../../_trail/geometry/lattice";
import type { Vertex } from "../../_trail/geometry/lattice";
import { fitBox, midX, spanAt } from "../../_trail/geometry/shapes";
import type { Box, Point } from "../../_trail/geometry/shapes";
import type { Cell } from "../../_trail/types";

/* ---- the ocean of stones -------------------------------------------------- */

/**
 * the header above the stones, for a page `width` px wide whose content starts
 * on lattice row `base`: the two filter hexagons' centers (either side of the
 * middle), where the counter goes, and the row the first stones are on
 */
export function oceanHeader(width: number, base: number) {
    const row = base + 3;
    const offset = Math.max(220, Math.min(300, width * 0.21));
    const snap = (x: number): Vertex => {
        const m = Math.round(x / HALF);
        return { m: isVertex(m, row) ? m : m + 1, l: row };
    };
    return {
        languageFilter: snap(width / 2 - offset),
        typeFilter: snap(width / 2 + offset),
        counterY: (row + 1) * ROW_H + 34,
        firstRow: base + 7,
    };
}

/**
 * centers for `count` stones across a page `width` px wide, the first row on
 * lattice row `firstRow`. neighbors sit one triangle apart (6 half-triangles
 * between centers), and each row is shifted half a step and 3 rows down. the
 * last row, if short, is centered.
 */
export function oceanSlots(width: number, count: number, firstRow: number) {
    const across = width / HALF;
    const perRow = Math.max(2, Math.floor((across - 9) / 6) + 1);
    const rows = Math.ceil(count / perRow);
    const span = 6 * (perRow - 1) + 4 + (rows > 1 ? 3 : 0);
    const want = (across - span) / 2 + 2;
    let m0 = Math.round(want);
    if (!isVertex(m0, firstRow)) m0 += want > m0 ? 1 : -1;

    const slots: Vertex[] = [];
    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / perRow);
        const inRow = Math.min(perRow, count - row * perRow);
        const centring = 6 * Math.floor((perRow - inRow) / 2);
        slots.push({ m: m0 + 6 * (i % perRow) + 3 * (row % 2) + centring, l: firstRow + 3 * row });
    }
    return { slots, rows };
}

/**
 * returns where the ocean section ends (either below the last row of stones or
 * the display, whichever is lower)
 */
export function oceanBottom(firstRow: number, rows: number, display: DisplayLayout) {
    const displayBottom = (display.r0 + display.spec.R) * ROW_H;
    return Math.max((firstRow + 3 * (rows - 1) + 1) * ROW_H + 90, displayBottom + 60);
}

/* ---- the project display -------------------------------------------------- */

/**
 * the display is built from whole triangles in R rows. row 0 holds the title
 * tab, a notch and the image tab; rows 1 .. R-2 are the body; row R-1 holds the
 * language and type tabs. the sides run straight out for P rows and straight
 * back in after, so each side has one point, and every tab is an odd number of
 * triangles, so each is a clean trapezoid.
 *
 * columns count from the top row's first triangle (column 0, pointing up).
 */
export interface DisplaySpec {
    /** triangles in the top row, title tab through image tab */
    T: number;
    R: number;
    P: number;
    title: [number, number];
    image: [number, number];
    /** the close triangle's column, one step past the image tab */
    close: number;
    languages: [number, number];
    type: [number, number];
}

const odd = (x: number) => 2 * Math.round((x - 1) / 2) + 1;

/** a display whose widest row fits in `availPx` */
function makeDisplaySpec(availPx: number, R = 8, P = 3): DisplaySpec {
    let T = Math.floor(availPx / HALF) - 2 * P + 1;
    if (T % 2 === 0) T -= 1;
    T = Math.max(13, T);

    // top row: title : notch : image, about 13 : 5 : 7, each an odd count
    let notch = Math.max(1, odd(T / 5));
    const image = Math.max(3, odd(0.28 * T));
    let title = T - notch - image;
    if (title < 7 && notch > 1) {
        notch = 1;
        title = T - notch - image;
    }

    // bottom row: two tabs with a gap between, inset two triangles from each end
    // when there's room (the narrowest displays use the whole row)
    const first = R - 2 * P;
    const length = T + 2 * P - 1 - R - first + 1;
    let inset = 0;
    let gap = 1;
    let tabWidth = 1;
    search: for (const ins of [2, 0]) {
        for (const g of [3, 5, 1]) {
            const w = (length - 2 * ins - g) / 2;
            if (w >= 3 && w % 2 === 1) {
                [inset, gap, tabWidth] = [ins, g, w];
                break search;
            }
        }
    }
    const languages: [number, number] = [first + inset, first + inset + tabWidth - 1];
    return {
        T,
        R,
        P,
        title: [0, title - 1],
        image: [title + notch, title + notch + image - 1],
        close: T + 1,
        languages,
        type: [languages[1] + gap + 1, languages[1] + gap + tabWidth],
    };
}

/** the columns body row `j` covers */
function rowSpan({ T, P }: DisplaySpec, j: number): [number, number] {
    return j < P ? [-j, T - 1 + j] : [-(2 * P - 1 - j), T + 2 * P - 2 - j];
}

/**
 * everything about the display for a page `width` px wide, its top row on
 * lattice row `r0`: its cells, where the left-right hexagons and close triangle go,
 * where the trail meets it, and the boxes its contents fill.
 */
export function layoutDisplay(width: number, r0: number) {
    // most of the page, leaving room for the left-right hexagons either side
    const spec = makeDisplaySpec(Math.min(width - 216, 0.86 * width - 136));
    const { T, R, P } = spec;

    // centered, with column 0 pointing up
    const want = width / 2 / HALF - (T + 1) / 2;
    let K0 = Math.round(want);
    if (!isUp(r0, K0)) K0 += want > K0 ? 1 : -1;

    const run = (j: number, [lo, hi]: [number, number]): Cell[] =>
        Array.from({ length: hi - lo + 1 }, (_, n) => ({ r: r0 + j, k: K0 + lo + n }));
    const body: Cell[] = [];
    for (let j = 1; j < R - 1; j++) body.push(...run(j, rowSpan(spec, j)));
    const cells = {
        body,
        title: run(0, spec.title),
        image: run(0, spec.image),
        languages: run(R - 1, spec.languages),
        type: run(R - 1, spec.type),
    };
    const close: Cell = { r: r0, k: K0 + spec.close };

    /** the left + right hexagons' centers: on the slanted edges, one row below each side point */
    const arrows = { left: { m: K0 - P + 2, l: r0 + P + 1 }, right: { m: K0 + T + P - 1, l: r0 + P + 1 } };

    /** where the trail comes down into the title tab, and leaves below the type tab */
    const [, titleEnd] = spec.title;
    const [typeStart, typeEnd] = spec.type;
    const titleIn: Point = [(K0 + (titleEnd + 2) / 2) * HALF, r0 * ROW_H];
    const typeOut: Point = [(K0 + (typeStart + typeEnd) / 2 + 1) * HALF, (r0 + R) * ROW_H];
    const anchors = {
        titleIn,
        titleWidth: (titleEnd / 2) * SIDE,
        typeOut,
        typeWidth: ((typeEnd - typeStart) / 2) * SIDE,
    };

    // the boxes the contents fill, each fitted to the shape's real outline
    const y = (rows: number) => (r0 + rows) * ROW_H;
    const titleSpan = fitBox(cells.title, y(0.3), y(0.9), midX(cells.title), 12);
    const linkSpan = fitBox(cells.image, y(0.35), y(0.9), midX(cells.image), 8);
    const bodyBox = fitBox(body, y(1.14), y(R - 2.1), midX(body), 26);
    const split = bodyBox.left + (bodyBox.right - bodyBox.left) * 0.64;
    const imageBox = fitBox(body, y(1.2), y(R - 3.05), (split + bodyBox.right) / 2, 22);
    const tab = (tabCells: Cell[]): Box => {
        const [left, right] = spanAt(tabCells, y(R - 0.5), midX(tabCells));
        return { left: left + 6, right: right - 6, top: y(R - 1) + 6, bottom: y(R) - 6 };
    };
    const boxes = {
        title: { ...titleSpan, top: y(0.06), bottom: y(0.96) },
        link: { ...linkSpan, top: y(0.1), bottom: y(0.96) },
        // the description starts a little closer to the edge than the rest
        // and reaches down to just above the skills, for a little room before it has to scroll
        description: { left: bodyBox.left - 16, right: split - 28, top: y(1.14), bottom: y(R - 1.86) - 4 },
        // kept clear of the ▶ hexagon
        image: {
            ...imageBox,
            left: Math.max(imageBox.left, split),
            right: Math.min(imageBox.right, (arrows.right.m - 2) * HALF - 14),
        },
        caption: { left: split, right: bodyBox.right, top: y(R - 2.92), bottom: y(R - 2.1) },
        skills: fitBox(body, y(R - 1.86), y(R - 1.14), midX(body), 30),
        languages: tab(cells.languages),
        type: tab(cells.type),
    };

    return { spec, K0, r0, cells, close, arrows, anchors, boxes };
}

export type DisplayLayout = ReturnType<typeof layoutDisplay>;
