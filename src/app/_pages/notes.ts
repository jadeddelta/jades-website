import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

/**
 * lane on the right side from top to bottom
 */
export const notesPage: PageConfig = {
    sectionIds: ["top"],
    buildRoute: (pageWidth) => {
        /* narrow, so it stays clear of the prose column */
        const HALF_WIDTH = clamp(pageWidth * 0.08, 70, 120);

        return {
            top: [wp(0, 0.12, HALF_WIDTH), wp(0.5, 0.17, HALF_WIDTH), wp(1, 0.12, HALF_WIDTH * 0.7)],
        };
    },
};
