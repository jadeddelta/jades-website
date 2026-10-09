import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

/**
 * high on the right, held through first row, cross to left and swings back to center
 */
export const projectsPage: PageConfig = {
    sectionIds: ["projects"],
    buildRoute: (pageWidth) => {
        const HALF_WIDTH = clamp(pageWidth * 0.125, 105, 190);

        return {
            projects: [
                wp(0, 0.8, HALF_WIDTH),
                wp(0.25, 0.8, HALF_WIDTH),
                wp(0.6, 0.2, HALF_WIDTH),
                wp(1, 0.5, HALF_WIDTH * 0.7),
            ],
        };
    },
};
