import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

/**
 * runs left edge like spine across timeline's own line, swaying slightly
 * so it's not a stripe and keeps away from job text
 */
export const workPage: PageConfig = {
    sectionIds: ["work"],
    buildRoute: (pageWidth) => {
        const HALF_WIDTH = clamp(pageWidth * 0.07, 70, 110);

        return {
            work: [
                wp(0, 0.07, HALF_WIDTH),
                wp(0.3, 0.11, HALF_WIDTH),
                wp(0.65, 0.06, HALF_WIDTH),
                wp(1, 0.09, HALF_WIDTH * 0.7),
            ],
        };
    },
};
