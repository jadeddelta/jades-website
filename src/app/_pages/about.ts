import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

export const aboutPage: PageConfig = {
    sectionIds: ["top"],
    buildRoute: (pageWidth) => {
        /* narrow, so it stays clear of the prose column */
        const HALF_WIDTH = clamp(pageWidth * 0.08, 70, 120);

        return {
            top: [wp(0, 0.86, HALF_WIDTH), wp(0.5, 0.82, HALF_WIDTH), wp(1, 0.87, HALF_WIDTH * 0.7)],
        };
    },
};
