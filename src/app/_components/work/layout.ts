import { HALF, ROW_H, SIDE, isVertex } from "../../_trail/geometry/lattice";
import type { Vertex } from "../../_trail/geometry/lattice";
import type { Box } from "../../_trail/geometry/shapes";
import type { Cell } from "../../_trail/types";
import { clamp } from "../../_pages/pageConfig";
import { timeline } from "../../_content/work";

/** half-width of the trail down the page */
export const SPINE = SIDE + 32;
/** minimum px gap between last bullet point and next job */
const GAP = 28;

/** returns how wide `text` is, in the mono font at `size` px with `spacing` em between letters */
export const monoWidth = (text: string, size: number, spacing: number) => text.length * size * (0.6 + spacing);

/** returns how wide the widest date is besides a stone, to position the trail's route column */
const DATES_WIDTH = Math.max(
    ...timeline.flatMap((job) => [job.startDate, job.endDate]).map((d) => monoWidth(d, 18, 0.06)), // values from work.css
);
/** returns how wide the widest company text is */
const COMPANY_WIDTH = Math.max(...timeline.map((job) => monoWidth(job.company, 17, 0.09))); // values from work.css

/** returns the lattice row of the section's top */
export const baseRow = (top: number) => Math.ceil(top / ROW_H) - 1;

/**
 * returns the first job's stone lattice row, for a page of `width` px
 * whose section starts at `top` px down, so that we can run the trail
 * above the first stone
 */
export function firstStoneRow(width: number, top: number) {
    const baseline = top + 12 + 0.85 * clamp(width * 0.044, 34, 54); // 12px + 0.85 of size from work.css
    return Math.ceil(baseline / ROW_H) + 2;
}

/**
 * returns the column the stones run down, for a page of `width` px whose section
 * starts at `top` px down. the stones will be positionined alternating left
 * to right with the dates on the left.
 */
export function workColumn(width: number, top: number) {
    const row = firstStoneRow(width, top);
    const want = (clamp(width * 0.11, 150, 230) + width * 0.1) / HALF; // about a 10th of the way
    const least = Math.ceil((24 + DATES_WIDTH + 16 + SIDE) / HALF);
    let m = Math.round(want);
    if (!isVertex(m, row)) m += want > m ? 1 : -1;
    if (m < least) m = isVertex(least, row) ? least : least + 1;
    return m;
}

/** returns the first row at or after `l` that has a vertex in column `m` */
const rowFrom = (m: number, l: number) => (isVertex(m, l) ? l : l + 1);

export interface JobPlace {
    center: Vertex;
    /** the job's title line, placed in the upper row to the right of the stone */
    titleCells: Cell[];
    /** the company line, placed in the lower row to the right of the stone */
    lowerCells: Cell[];
    titleBox: Box;
    lowerBox: Box;
    /** placed beside the left of the stone */
    datesRight: number;
    /** the leading sentence and points */
    text: { left: number; top: number; width: number };
    bottom: number;
}

/**
 * returns the layout (every job stone and text) for a page of `width` px wide
 * whose section starts `top` px down. `heights` are the text blocks as last measured,
 * and `titleWidth` the widest job title.
 *
 * the trail starts at the top right matching the project trail's end, before going
 * left parallel and above the job title container, and then stretching down to the
 * rest of the page.
 */
export function workLayout(width: number, top: number, heights: number[], titleWidth: number) {
    const m0 = workColumn(width, top);
    const x0 = m0 * HALF;
    // amount of cells every title line runs past its hexagon, the same for every stone (so a right-step stone's
    // juts out further): even, so it closes on an upward triangle's slant like the hexagon's own rows, far enough
    // for the widest title, and on the page even from the right column
    const even = (n: number) => 2 * Math.floor(n / 2);
    /** the even run whose line box holds `px` of text past `inset` px of hexagon and padding */
    const holds = (px: number, inset: number) => 2 * Math.ceil((Math.ceil((px + inset) / HALF) - 1) / 2);
    const target = even(Math.round((x0 + clamp(width * 0.46, 560, 720)) / HALF) - 1 - m0);
    const onPage = even(Math.floor((width - 16) / HALF) - 3 - m0);
    const run = Math.min(onPage, Math.max(holds(titleWidth, SIDE + 12), target));
    // the company line runs two thirds as far or further when the widest company needs it
    const lowerRun = Math.min(run, Math.max(2 * Math.round(run / 3), holds(COMPANY_WIDTH, SIDE + 2)));

    const places: JobPlace[] = [];
    let l = firstStoneRow(width, top);
    heights.forEach((height, i) => {
        const m = m0 + (i % 2);
        l = rowFrom(m, l);
        const cx = m * HALF;
        const titleLast = m + run;
        const lowerLast = m + lowerRun;
        const lineTop = (l - 1) * ROW_H;
        const row = (r: number, last: number): Cell[] =>
            Array.from({ length: last - m }, (_, n) => ({ r, k: m + 1 + n }));
        // text starts under the hexagon's bottom-left corner, so it steps right with the stone
        const textLeft = cx - HALF + 4;
        const textTop = (l + 1) * ROW_H + 20;
        const bottom = textTop + height;
        places.push({
            center: { m, l },
            titleCells: row(l - 1, titleLast),
            lowerCells: row(l, lowerLast),
            // clear of the hexagon's right point, up to the line's top-right corner
            titleBox: { left: cx + SIDE + 6, right: (titleLast + 1) * HALF - 6, top: lineTop, bottom: lineTop + ROW_H },
            lowerBox: {
                left: cx + SIDE + 6,
                right: (lowerLast + 1) * HALF + 4,
                top: lineTop + ROW_H,
                bottom: lineTop + 2 * ROW_H,
            },
            datesRight: cx - SIDE - 16,
            // as far right as a tenth of the page past 740px, but clear of the page's edge
            text: { left: textLeft, top: textTop, width: Math.min(740 + width * 0.1, width - 64 - textLeft) },
            bottom,
        });
        // the next stone's top row clears this job's text (and its column picks the row)
        l = Math.ceil((bottom + GAP) / ROW_H) + 1;
    });

    return { places, end: (places.at(-1)?.bottom ?? 0) + 110 };
}
