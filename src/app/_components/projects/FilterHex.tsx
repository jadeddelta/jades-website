import { Fragment } from "react";
import type { CSSProperties } from "react";
import { centroidX, centroidY, isUp, ROW_H, SIDE } from "../../_trail/geometry/lattice";
import type { Vertex } from "../../_trail/geometry/lattice";
import { cellCorners, hexCells, outline, pathD, vertexPoint } from "../../_trail/geometry/shapes";
import { twoTone } from "./twoTone";

export interface FilterOption {
    id: string;
    /** shown by the triangle */
    name: string;
    /** color string that determines r,g,b on hover */
    rgb: string;
    /** icon inside the triangle, text label if not provided */
    icon?: string;
}

interface FilterHexProps {
    title: string;
    center: Vertex;
    /** document y of the element this is positioned in */
    originY: number;
    /** six slots, clockwise from the top. null means no icon + inert slot */
    options: (FilterOption | null)[];
    active: Set<string>;
    onToggle: (id: string) => void;
}

/** a hexagon whose six triangles are filter toggles, each named outside it */
export default function FilterHex({ title, center, originY, options, active, onToggle }: FilterHexProps) {
    const cells = hexCells(center.m, center.l);
    const [x0, y0] = vertexPoint(center);
    const hexBox = { left: x0 - SIDE, top: y0 - ROW_H, width: 2 * SIDE, height: 2 * ROW_H };

    return (
        <div role="group" aria-label={`filter by ${title}`} className="filter-hex">
            <span className="filter-title" style={{ left: x0, top: y0 - ROW_H - 50 - originY }}>
                {title}
            </span>
            {cells.map((cell, i) => {
                const option = options[i];
                const corners = cellCorners(cell);
                const left = cell.k * (SIDE / 2);
                const top = cell.r * ROW_H;
                const cx = centroidX(cell.k);
                const cy = centroidY(cell.r, cell.k);
                const points = corners.map(([x, y]) => `${x},${y}`).join(" ");
                const style = {
                    left,
                    top: top - originY,
                    width: SIDE,
                    height: ROW_H,
                    clipPath: isUp(cell.r, cell.k)
                        ? "polygon(50% 0, 100% 100%, 0 100%)"
                        : "polygon(0 0, 100% 0, 50% 100%)",
                    "--c": option?.rgb,
                } as CSSProperties;
                const svg = (
                    <svg viewBox={`${left} ${top} ${SIDE} ${ROW_H}`} width={SIDE} height={ROW_H} aria-hidden="true">
                        <polygon points={points} className="filter-slot" />
                        {option?.icon ? (
                            <g
                                transform={`translate(${cx - 23} ${cy - 23}) scale(0.46)`}
                                dangerouslySetInnerHTML={{ __html: twoTone(option.id, option.icon, option.rgb) }}
                            />
                        ) : option ? (
                            <text x={cx} y={cy + 4} className="filter-code">
                                {option.id}
                            </text>
                        ) : null}
                    </svg>
                );
                if (!option) {
                    return (
                        <span key={i} className="filter-cell empty" style={style}>
                            {svg}
                        </span>
                    );
                }
                const on = active.has(option.id);
                // the name sits outside the triangle, in line with the center
                const dx = cx - x0;
                const dy = cy - y0;
                const len = Math.hypot(dx, dy);
                return (
                    <Fragment key={i}>
                        <button
                            type="button"
                            className={"filter-cell" + (on ? " on" : "")}
                            style={style}
                            aria-pressed={on}
                            aria-label={option.name}
                            onClick={() => onToggle(option.id)}
                        >
                            {svg}
                        </button>
                        <span
                            className={"filter-name" + (on ? " on" : "")}
                            style={{
                                left: x0 + (dx / len) * 118,
                                top: y0 + (dy / len) * 104 - originY,
                                transform: `translate(${dx < -1 ? "-100%" : dx > 1 ? "0" : "-50%"}, -50%)`,
                            }}
                            aria-hidden="true"
                            onClick={() => onToggle(option.id)}
                        >
                            {option.name}
                        </span>
                    </Fragment>
                );
            })}
            <svg
                className="filter-outline"
                style={{ left: hexBox.left, top: hexBox.top - originY }}
                viewBox={`${hexBox.left} ${hexBox.top} ${hexBox.width} ${hexBox.height}`}
                width={hexBox.width}
                height={hexBox.height}
                aria-hidden="true"
            >
                <path d={pathD(outline(cells))} />
            </svg>
        </div>
    );
}
