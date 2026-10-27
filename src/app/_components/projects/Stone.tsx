import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { HALF, ROW_H } from "../../_trail/geometry/lattice";
import type { Vertex } from "../../_trail/geometry/lattice";
import { hexCells, outline, pathD, vertexPoint } from "../../_trail/geometry/shapes";
import { CATEGORIES } from "../../_content/projects";
import type { Project } from "../../_content/projects";
import { twoTone } from "./twoTone";

/** stone icons, all as SVG */
export interface StoneIcons {
    language: string;
    wildcard: string;
    project: string;
}

/**
 * the hexagon's six cells (clockwise from the top) split into three rhombi.
 * left = the language, lower right = the project's own mark, upper right = the wildcard
 */
const RHOMBI = [
    { slot: "language", cells: [5, 4] },
    { slot: "project", cells: [3, 2] },
    { slot: "wildcard", cells: [0, 1] },
] as const;

/** the edges between the rhombi run from the center to these three corners */
const SEAM_ENDS = [
    [-1, -1],
    [2, 0],
    [-1, 1],
];

interface StoneProps {
    project: Project;
    icons: StoneIcons;
    /** the lattice vertex the hexagon sits around */
    center: Vertex;
    /** document y of the element these are positioned in */
    originY: number;
    dim: boolean;
    /** picked: sunk under the surface while its display is open */
    sunk: boolean;
    onSelect: () => void;
}

/** a project on the lattice: a hexagon of three icon rhombi, with its title under it */
export default function Stone({ project, icons, center, originY, dim, sunk, onSelect }: StoneProps) {
    // coming back up is a quick pop (see .resurface), not the sink played backwards
    const [wasSunk, setWasSunk] = useState(sunk);
    const [popping, setPopping] = useState(false);
    if (sunk !== wasSunk) {
        setWasSunk(sunk);
        setPopping(!sunk);
    }

    const clipId = useId().replace(/[^\w-]/g, "");
    const rgb = CATEGORIES[project.category].rgb;
    const cells = hexCells(center.m, center.l);
    const [cx, cy] = vertexPoint(center);
    const box = { left: cx - 2 * HALF, top: cy - ROW_H, width: 4 * HALF, height: 2 * ROW_H };
    const names = { language: project.language, wildcard: project.wildcardSvg, project: project.projectSvg };

    return (
        <button
            type="button"
            className={"stone" + (dim ? " dim" : "") + (sunk ? " sunk" : "") + (popping ? " resurface" : "")}
            style={
                {
                    left: box.left,
                    top: box.top - originY,
                    width: box.width,
                    height: box.height,
                    "--type": rgb,
                } as CSSProperties
            }
            aria-label={`${project.name}: ${CATEGORIES[project.category].name}, ${project.language}, ${project.wildcardSvg}`}
            data-project={project.name}
            onClick={onSelect}
            onAnimationEnd={() => setPopping(false)}
        >
            <svg
                className="stone-shape"
                viewBox={`${box.left} ${box.top} ${box.width} ${box.height}`}
                width={box.width}
                height={box.height}
                aria-hidden="true"
            >
                {RHOMBI.map(({ slot, cells: pair }) => {
                    const corners = outline(pair.map((i) => cells[i]))[0];
                    const points = corners.map(([x, y]) => `${x},${y}`).join(" ");
                    // the icon is a touch bigger than its rhombus and pushed outward, so it's cut off but readable
                    const rx = corners.reduce((sum, [x]) => sum + x, 0) / corners.length;
                    const ry = corners.reduce((sum, [, y]) => sum + y, 0) / corners.length;
                    const x = rx + (rx - cx) * 0.28 - 52;
                    const y = ry + (ry - cy) * 0.28 - 52;
                    return (
                        <g key={slot}>
                            <clipPath id={`${clipId}-${slot}`}>
                                <polygon points={points} />
                            </clipPath>
                            <polygon points={points} className="rhombus" />
                            <g clipPath={`url(#${clipId}-${slot})`}>
                                <g
                                    transform={`translate(${x} ${y}) scale(1.04)`}
                                    dangerouslySetInnerHTML={{ __html: twoTone(names[slot], icons[slot], rgb) }}
                                />
                            </g>
                        </g>
                    );
                })}
                {SEAM_ENDS.map(([dm, dl]) => {
                    const [x, y] = vertexPoint({ m: center.m + dm, l: center.l + dl });
                    return <line key={`${dm},${dl}`} x1={cx} y1={cy} x2={x} y2={y} className="seam" />;
                })}
                <path d={pathD(outline(cells))} className="stone-border" />
            </svg>
            <span className="stone-card">{project.name}</span>
        </button>
    );
}
