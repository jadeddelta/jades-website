import { HALF, ROW_H, SIDE } from "../_trail/geometry/lattice";
import { layoutDisplay, oceanHeader, oceanSlots } from "../_components/projects/layout";
import { projects } from "../_content/projects";
import type { TrailRoute } from "../_trail/types";
import { clamp, wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

/**
 * comes in through the top edge at the top-left (where the previous page's trail
 * will hand over) and down into the column of the project display's title tab,
 * spreads into an ocean wide enough that every stone has at least one ring of
 * tiles around it, then leaves straight down
 * from below the display's type tab. it lines up with the display because it's
 * worked out from the same layout, using where the page actually put the sections.
 */
export const projectsPage: PageConfig = {
    // two markers the ocean draws: section top to the display's top, then the rest
    sectionIds: ["projects-inflow", "projects-ocean"],
    heroSection: "projects-inflow",
    // the ocean may fill the page's whole width, so stones by the edge keep a ring of tiles
    fullWidthSections: ["projects-ocean"],
    buildRoute: (pageWidth, sections): TrailRoute => {
        const inflow = sections.find((s) => s.id === "projects-inflow");
        const ocean = sections.find((s) => s.id === "projects-ocean");
        if (!inflow || !ocean) return {};

        // the same layout the page used (see Ocean.tsx)
        const header = oceanHeader(pageWidth, Math.ceil(inflow.top / ROW_H) - 1);
        const display = layoutDisplay(pageWidth, header.firstRow - 1);
        const { slots, rows } = oceanSlots(pageWidth, projects.length, header.firstRow);
        const xs = slots.map((s) => s.m * HALF);
        const [left, right] = [Math.min(...xs), Math.max(...xs)];
        const lastRow = header.firstRow + 3 * (rows - 1);

        const inOcean = (y: number) => (y - ocean.top) / ocean.height;
        const [titleX] = display.anchors.titleIn;
        const [typeX, typeY] = display.anchors.typeOut;
        // the inflow is twice the usual thickness, its left edge on the page's left edge
        const IN = clamp(display.anchors.titleWidth, 230, 320);
        // a stone reaches SIDE either side of its center; one more tile beyond that, plus a little slack
        const SPREAD = (right - left) / 2 + 2 * SIDE + 30;
        const oceanX = (left + right) / 2 / pageWidth;
        // a stone row spans the lattice rows above and below its center, so the ring of tiles
        // reaches one row further: from 2 rows above the first stones to 2 rows below the last
        const oceanTop = (header.firstRow - 2) * ROW_H;
        const oceanBottom = (lastRow + 2) * ROW_H;
        const inInflow = (y: number) => (y - inflow.top) / inflow.height;
        const OUT = clamp(display.anchors.typeWidth / 2 + 50, 110, 150);

        return {
            // two points with an eased curve between, so it leaves the top and meets the title tab heading straight down
            // then it opens out into the ocean a row above the stones
            "projects-inflow": [
                wp(0, IN / pageWidth, IN),
                wp(inInflow(oceanTop - ROW_H), titleX / pageWidth, IN),
                wp(inInflow(oceanTop), oceanX, SPREAD),
                wp(1, oceanX, SPREAD),
            ],
            "projects-ocean": [
                wp(0, oceanX, SPREAD),
                wp(inOcean(oceanBottom), oceanX, SPREAD),
                // narrows to the outflow below the display (or below the ocean, if it runs deeper)
                wp(inOcean(Math.max(typeY, oceanBottom + ROW_H)), typeX / pageWidth, OUT),
                wp(1, typeX / pageWidth, OUT),
            ],
        };
    },
};
