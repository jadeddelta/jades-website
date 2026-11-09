import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

export const aboutPage: PageConfig = {
    sectionIds: ["top"],
    // hugs the right edge, so it needs to reach it to fit a tile beside the content
    fullWidthSections: ["top"],
    buildRoute: (pageWidth) => {
        /* slim, and out past the right edge of the page's 70%-wide content */
        const HALF_WIDTH = clamp(pageWidth * 0.06, 60, 90);

        return {
            top: [wp(0, 0.96, HALF_WIDTH), wp(0.5, 0.95, HALF_WIDTH), wp(1, 0.96, HALF_WIDTH * 0.85)],
        };
    },
};
