import type { SectionBox, TrailRoute, Waypoint } from "../_trail/types";

/**
 * everything trail needs to know about a page for generation.
 *
 * each id in `sectionIds` must be the `id` of an element on a page as the trail
 * measures sections by id. will warn if one is missing
 */
export interface PageConfig {
    /** section ids in document order */
    sectionIds: string[];
    /** the trail's route through those sections, keyed by id and resolved against page width */
    buildRoute: (pageWidth: number, sections: SectionBox[]) => TrailRoute;
    /** section that runs off-screen left and wears an extra tile layer */
    heroSection?: string;
    /** sections where the trail may run to both page edges, instead of keeping a small margin */
    fullWidthSections?: string[];
}

/* --- helpers for writing routes ------------------------------------------ */

export const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));

/** one waypoint: `at` down the section, `x` across the page, `halfWidth` in px */
export const wp = (at: number, x: number, halfWidth: number): Waypoint => ({ at, x, halfWidth });
