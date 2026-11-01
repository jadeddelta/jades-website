import { HALF, ROW_H, SIDE } from "../_trail/geometry/lattice";
import { buildCenterline } from "../_trail/geometry/centerline";
import { layoutDisplay, oceanBottom, oceanHeader, oceanSlots } from "../_components/projects/layout";
import { SPINE, baseRow, firstStoneRow, workColumn } from "../_components/work/layout";
import { projects } from "../_content/projects";
import type { TrailRoute } from "../_trail/types";
import { projectsPage } from "./projects";
import { wp } from "./pageConfig";
import type { PageConfig } from "./pageConfig";

/** how much wider the drop from the top edge gets, all of it to the left, by the time it reaches the band */
const CURL = SIDE * 1.5;

/**
 * where the projects page's trail crosses the bottom of its page, at the same
 * width: its own route, through its sections where Ocean.tsx would put them,
 * read off at the page's last pixel. both pages' sections start at the same
 * `top`, right under the nav, and share the footer.
 */
function projectsOutflow(width: number, top: number) {
    const header = oceanHeader(width, baseRow(top));
    const display = layoutDisplay(width, header.firstRow - 1);
    const { rows } = oceanSlots(width, projects.length, header.firstRow);
    const displayTop = display.r0 * ROW_H;
    const bottom = oceanBottom(header.firstRow, rows, display);
    const sections = [
        { id: "projects-inflow", top, height: displayTop - top },
        { id: "projects-ocean", top: displayTop, height: bottom - displayTop },
    ];
    const pageEnd = bottom + (document.querySelector("footer")?.offsetHeight ?? 98);
    const line = buildCenterline(
        sections,
        projectsPage.buildRoute(width, sections),
        projectsPage.sectionIds,
        width,
        pageEnd,
    );
    return line ? { x: line.xAt(pageEnd), halfWidth: line.hwAt(pageEnd) } : { x: width / 2, halfWidth: SPINE };
}

/**
 * comes in through the top edge where the projects page's trail left through
 * its bottom and drops straight down to the row under the heading, runs left
 * along that row as a flat band, then turns down into the stones' column and
 * runs straight down it. the column and first stone are worked out from the
 * same layout the timeline uses.
 */
export const workPage: PageConfig = {
    sectionIds: ["work"],
    // a stone at the left keeps a full ring of tiles
    fullWidthSections: ["work"],
    buildRoute: (pageWidth, sections): TrailRoute => {
        const work = sections.find((s) => s.id === "work");
        if (!work) return {};

        const inflow = projectsOutflow(pageWidth, work.top);
        const column = (workColumn(pageWidth, work.top) + 0.5) * HALF;
        // the band's row sits on top of the first stone's top row
        const band = (firstStoneRow(pageWidth, work.top) - 2) * ROW_H;
        // from the spine's left edge (so nothing pokes out past the stones) to the incoming trail's right edge
        const left = column - SPINE;
        const right = Math.max(inflow.x + inflow.halfWidth, column + SPINE);
        const at = (y: number) => (y - work.top) / work.height;
        const x = (px: number) => px / pageWidth;

        // drop thickens leftward, to emulate curling, into the band, which is placed above the
        // first stone's title card.
        return {
            work: [
                wp(0, x(inflow.x), inflow.halfWidth),
                wp(at(band - ROW_H * 0.15), x(inflow.x - CURL), inflow.halfWidth + CURL),
                wp(at(band + ROW_H * 0.1), x((left + right) / 2), (right - left) / 2),
                wp(at(band + ROW_H * 0.9), x((left + right) / 2), (right - left) / 2),
                wp(at(band + ROW_H * 1.1), x(column), SPINE),
                wp(1, x(column), SPINE),
            ],
        };
    },
};
