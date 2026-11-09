import { useId } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { HALF, ROW_H, SIDE } from "../../_trail/geometry/lattice";
import { hexCells, outline, pathD, vertexPoint } from "../../_trail/geometry/shapes";
import type { Point } from "../../_trail/geometry/shapes";
import type { Project } from "../../_content/projects";
import type { TimelineEntry } from "../../_content/work";
import { twoTone } from "../projects/twoTone";
import { stableHtml } from "../stableHtml";
import { monoWidth } from "./layout";
import type { JobPlace } from "./layout";

/**
 * the hexagon's six cells (clockwise from the top) as three rhombi, in the
 * order a job's projects fill them: left, upper right (under the title line),
 * lower right (over the company line)
 */
const RHOMBI = [
    [5, 4],
    [0, 1],
    [3, 2],
] as const;

/** the edges between the rhombi run from the center to these three corners */
const SEAM_ENDS = [
    [-1, -1],
    [2, 0],
    [-1, 1],
];

interface JobStoneProps {
    job: TimelineEntry;
    /** left, upper right, lower right: a project, or null for an inert gray rhombus */
    rhombi: (Project | null)[];
    place: JobPlace;
    /** svg markup for each project's own mark, by icon name */
    icons: Record<string, string>;
    /** document y of the element these are positioned in */
    originY: number;
    /** the project being pointed at in this job, if any */
    lit: string | null;
    /** the project whose display is open from this stone, if any */
    picked: string | null;
    onHover: (project: string | null) => void;
    onPick: (project: Project, center: Point) => void;
}

const polyPoints = (corners: Point[]) => corners.map(([x, y]) => `${x},${y}`).join(" ");
const mean = (corners: Point[], i: 0 | 1) => corners.reduce((sum, c) => sum + c[i], 0) / corners.length;

/** one job on the timeline: its hexagon of project rhombi, with the title line and lower line running off it */
export default function JobStone({ job, rhombi, place, icons, originY, lit, picked, onHover, onPick }: JobStoneProps) {
    const clipId = useId().replace(/[^\w-]/g, "");
    const { center, titleCells, lowerCells, titleBox, lowerBox } = place;
    const cells = hexCells(center.m, center.l);
    const [cx, cy] = vertexPoint(center);
    const right = Math.max(...[...titleCells, ...lowerCells].map((c) => (c.k + 2) * HALF)) + 4;
    const box = { left: cx - SIDE - 4, top: cy - ROW_H - 4, width: right - (cx - SIDE - 4), height: 2 * ROW_H + 8 };

    const litProject = rhombi.find((p) => p?.name === lit);
    // a long project name shrinks to fit the company line, rather than running past its slanted end
    const lowerWidth = lowerBox.right - lowerBox.left;
    const nameSize = litProject ? Math.min(17, (17 * (lowerWidth - 8)) / monoWidth(litProject.name, 17, 0.09)) : 17;

    return (
        <>
            <svg
                className="job-stone"
                style={{ left: box.left, top: box.top - originY }}
                viewBox={`${box.left} ${box.top} ${box.width} ${box.height}`}
                width={box.width}
                height={box.height}
            >
                <path d={pathD(outline(lowerCells))} className="line-cells lower" />
                <path d={pathD(outline(titleCells))} className="line-cells title" />

                {RHOMBI.map((pair, slot) => {
                    const project = rhombi[slot];
                    const corners = outline(pair.map((i) => cells[i]))[0];
                    const points = polyPoints(corners);
                    if (!project) return <polygon key={slot} points={points} className="rhombus inert" />;

                    const rgb = project.rgb;
                    // as on the projects page: a touch bigger than the rhombus and pushed outward
                    const [rx, ry] = [mean(corners, 0), mean(corners, 1)];
                    const x = rx + (rx - cx) * 0.28 - 52;
                    const y = ry + (ry - cy) * 0.28 - 52;
                    const pick = () => onPick(project, [rx, ry]);
                    return (
                        <g
                            key={slot}
                            role="button"
                            tabIndex={0}
                            aria-label={`${project.name}: open project`}
                            data-rhombus={`${job.startDate}|${project.name}`}
                            className={
                                "rhombus-button" +
                                (lit === project.name ? " lit" : "") +
                                (picked === project.name ? " picked" : "")
                            }
                            style={{ "--c": rgb } as CSSProperties}
                            onMouseEnter={() => onHover(project.name)}
                            onMouseLeave={() => onHover(null)}
                            // focus lights it only from the keyboard: a click already lit it, and focus handed
                            // back when the display closes shouldn't leave it lit under a pointer that's gone
                            onFocus={(e) => e.currentTarget.matches(":focus-visible") && onHover(project.name)}
                            onBlur={() => onHover(null)}
                            onClick={pick}
                            onKeyDown={(e: KeyboardEvent) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    pick();
                                }
                            }}
                        >
                            <clipPath id={`${clipId}-${slot}`}>
                                <polygon points={points} />
                            </clipPath>
                            <polygon points={points} className="rhombus" />
                            <g clipPath={`url(#${clipId}-${slot})`} className="rhombus-icon">
                                <g
                                    transform={`translate(${x} ${y}) scale(1.04)`}
                                    dangerouslySetInnerHTML={stableHtml(
                                        twoTone(project.projectSvg, icons[project.projectSvg], rgb),
                                    )}
                                />
                            </g>
                            <polygon points={points} className="rhombus-edge" />
                        </g>
                    );
                })}

                {SEAM_ENDS.map(([dm, dl]) => {
                    const [x, y] = vertexPoint({ m: center.m + dm, l: center.l + dl });
                    return <line key={`${dm},${dl}`} x1={cx} y1={cy} x2={x} y2={y} className="seam" />;
                })}
                {/* the whole hexagon in jade, over the edge it shares with the (muted) lower line */}
                <path d={pathD(outline(cells))} className="hex-outline" />
            </svg>

            <div
                className="job-title"
                style={{
                    left: titleBox.left,
                    top: titleBox.top - originY,
                    width: titleBox.right - titleBox.left,
                    height: titleBox.bottom - titleBox.top,
                }}
            >
                <h2>{job.jobTitle}</h2>
            </div>
            <div
                className={"job-lower" + (litProject ? " naming" : "")}
                style={{
                    left: lowerBox.left,
                    top: lowerBox.top - originY,
                    width: lowerWidth,
                    height: lowerBox.bottom - lowerBox.top,
                    ...(litProject ? ({ "--c": litProject.rgb } as CSSProperties) : {}),
                }}
            >
                <span className="lower-text">{job.company}</span>
                {/* on hovering a rhombus, replace company name with the project title */}
                <span className="naming-label" aria-hidden="true" style={{ fontSize: nameSize }}>
                    {litProject?.name ?? ""}
                </span>
            </div>
            {/* to is placed at the y-level of the stone, end date on top and start on bottom */}
            <div className="job-dates" style={{ left: place.datesRight, top: cy - originY }}>
                <span>{job.endDate}</span>
                <span className="to">to</span>
                <span>{job.startDate}</span>
            </div>
        </>
    );
}
