import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

/**
 * offscreen left, wide sweep, narrows to footer
 */
export const homePage: PageConfig = {
    sectionIds: ["hero"],
    heroSection: "hero",
    buildRoute: (pageWidth) => {
        /* default band half-width, and the much wider hero band */
        const HALF_WIDTH = clamp(pageWidth * 0.125, 105, 190);
        const HERO = clamp(pageWidth * 0.3, 200, 450);

        return {
            hero: [wp(0, -0.24, HERO), wp(0.34, 0.1, HERO), wp(0.68, 0.28, HERO * 0.9), wp(1, 0.44, HALF_WIDTH * 1.6)],
        };
    },
};
