import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { HALF, ROW_H, SIDE, isUp } from "../../_trail/geometry/lattice";
import type { Vertex } from "../../_trail/geometry/lattice";
import { cellCenter, cellCorners, hexCells, outline, pathD, vertexPoint } from "../../_trail/geometry/shapes";
import type { Box, Point } from "../../_trail/geometry/shapes";
import type { Cell } from "../../_trail/types";
import { CATEGORIES } from "../../_content/projects";
import type { Project } from "../../_content/projects";
import type { DisplayLayout } from "./layout";
import { ripple } from "./ripple";
import type { RippleCell } from "./ripple";

const HEXAGON_CLIP = "polygon(0 50%, 25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%)";
const UP_CLIP = "polygon(50% 0, 100% 100%, 0 100%)";
const DOWN_CLIP = "polygon(0 0, 100% 0, 50% 100%)";

interface DisplayProps {
    project: Project;
    languageIcon: string;
    layout: DisplayLayout;
    /** page width in px, for the svg layer */
    width: number;
    /** document y of the element this is positioned in */
    originY: number;
    /** where the cells ripple in from (the picked stone) */
    origin: Point;
    /** set when the display is folding away: the point it folds toward */
    closingToward?: Point;
    /** a ring through the display's cells, e.g. from the ◀ ▶ that was pressed; a new key runs it */
    ring?: { x: number; y: number; key: number };
    onPrev?: () => void;
    onNext?: () => void;
    onClose?: () => void;
}

const points = (corners: Point[]) => corners.map(([x, y]) => `${x},${y}`).join(" ");

/** hexagon-shaped button around vertex `center` */
function ArrowButton({
    center,
    originY,
    label,
    glyph,
    onClick,
}: {
    center: Vertex;
    originY: number;
    label: string;
    glyph: string;
    onClick?: () => void;
}) {
    const [x, y] = vertexPoint(center);
    const cells = hexCells(center.m, center.l);
    const box = { left: x - SIDE, top: y - ROW_H, width: 2 * SIDE, height: 2 * ROW_H };
    return (
        <button
            type="button"
            className="display-arrow"
            style={{
                left: box.left,
                top: box.top - originY,
                width: box.width,
                height: box.height,
                clipPath: HEXAGON_CLIP,
            }}
            aria-label={label}
            onClick={onClick}
        >
            <svg
                viewBox={`${box.left} ${box.top} ${box.width} ${box.height}`}
                width={box.width}
                height={box.height}
                aria-hidden="true"
            >
                {cells.map((cell) => (
                    <polygon key={`${cell.r}:${cell.k}`} points={points(cellCorners(cell))} className="arrow-cell" />
                ))}
                <path d={pathD(outline(cells))} className="arrow-border" />
                <text x={x} y={y + 8} className="arrow-glyph">
                    {glyph}
                </text>
            </svg>
        </button>
    );
}

/**
 * project display, which is bounded by whole lattice cells containing all the information.
 *
 * top-left notch: title                   || top-right notch: link (if applicable)
 * bottom-left notch: programming language || bottom-right notch: programming field
 */
export default function Display(props: DisplayProps) {
    const { project, languageIcon, layout, width, originY, origin, closingToward, ring } = props;
    const { spec, r0, cells, close, arrows, boxes } = layout;
    const rgb = CATEGORIES[project.category].rgb;
    const shapeTop = r0 * ROW_H;
    const shapeHeight = spec.R * ROW_H;
    const allCells: Cell[] = [...cells.body, ...cells.title, ...cells.image, ...cells.languages, ...cells.type];

    // the cells fade in a frame after mounting, so their transition runs
    const [shown, setShown] = useState(false);
    useEffect(() => {
        let inner = 0;
        const outer = requestAnimationFrame(() => (inner = requestAnimationFrame(() => setShown(true))));
        return () => {
            cancelAnimationFrame(outer);
            cancelAnimationFrame(inner);
        };
    }, []);

    // a ring through the cells' outlines whenever `ring.key` changes
    const cellEls = useRef(new Map<string, RippleCell>());
    useEffect(() => {
        if (!ring) return;
        return ripple([...cellEls.current.values()], ring.x, ring.y, rgb);
        // the ring is keyed: re-run only for a new key
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ring?.key]);

    // focus moves into the display when it opens, so keyboard users land on it
    const regionRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!closingToward) regionRef.current?.focus({ preventScroll: true });
        // only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // the title stays whole: one line from 34px down to 24px, then two lines from 28px down to 18px
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const fit = () => {
            const h = titleRef.current;
            if (!h) return;
            const room = h.parentElement!.clientWidth - 4;
            const range = document.createRange();
            range.selectNodeContents(h);
            h.classList.remove("two");
            let size = 34;
            h.style.fontSize = `${size}px`;
            while (range.getBoundingClientRect().width > room && size > 24) h.style.fontSize = `${--size}px`;
            if (range.getBoundingClientRect().width <= room) return;
            h.classList.add("two");
            size = 28;
            h.style.fontSize = `${size}px`;
            while (h.scrollHeight > h.parentElement!.clientHeight + 1 && size > 18) h.style.fontSize = `${--size}px`;
        };
        fit();
        document.fonts?.ready.then(fit, () => {});
        const description = descriptionRef.current;
        if (description) {
            description.scrollTop = 0;
            description.classList.toggle("overflows", description.scrollHeight > description.clientHeight + 2);
        }
    }, [project, boxes]);

    const place = (box: Box): CSSProperties => ({
        left: box.left,
        top: box.top - originY,
        width: box.right - box.left,
        height: box.bottom - box.top,
    });
    const delay = (cell: Cell) => {
        const [x, y] = cellCenter(cell);
        if (closingToward) return Math.max(0, 600 - Math.hypot(x - closingToward[0], y - closingToward[1]) / 1.6);
        return 260 + Math.min(900, Math.hypot(x - origin[0], y - origin[1]) / 1.6);
    };
    const closeBox = { left: close.k * HALF, top: close.r * ROW_H, width: SIDE, height: ROW_H };
    const link = project.linkText ?? "view project";

    return (
        <div
            ref={regionRef}
            role="region"
            aria-label={project.name}
            tabIndex={-1}
            className={"display" + (shown && !closingToward ? " in" : "") + (closingToward ? " out" : "")}
            style={{ "--type": rgb } as CSSProperties}
        >
            <svg
                className="display-shape"
                style={{ top: shapeTop - originY }}
                viewBox={`0 ${shapeTop} ${width} ${shapeHeight}`}
                width={width}
                height={shapeHeight}
                aria-hidden="true"
            >
                {allCells.map((cell) => {
                    const key = `${cell.r}:${cell.k}`;
                    const [x, y] = cellCenter(cell);
                    return (
                        <polygon
                            key={key}
                            ref={(el) => {
                                if (el) cellEls.current.set(key, { el, x, y });
                                else cellEls.current.delete(key);
                            }}
                            points={points(cellCorners(cell))}
                            className="display-cell"
                            style={{ transitionDelay: `${delay(cell).toFixed(0)}ms` }}
                        />
                    );
                })}
                <path d={pathD(outline(allCells))} className="display-border" />
            </svg>

            <ArrowButton
                center={arrows.left}
                originY={originY}
                label="previous project"
                glyph="◀"
                onClick={props.onPrev}
            />
            <ArrowButton
                center={arrows.right}
                originY={originY}
                label="next project"
                glyph="▶"
                onClick={props.onNext}
            />
            <button
                type="button"
                className="display-close"
                style={{
                    left: closeBox.left,
                    top: closeBox.top - originY,
                    width: closeBox.width,
                    height: closeBox.height,
                    clipPath: isUp(close.r, close.k) ? UP_CLIP : DOWN_CLIP,
                }}
                aria-label="close project"
                onClick={props.onClose}
            >
                <svg
                    viewBox={`${closeBox.left} ${closeBox.top} ${SIDE} ${ROW_H}`}
                    width={SIDE}
                    height={ROW_H}
                    aria-hidden="true"
                >
                    <polygon points={points(cellCorners(close))} className="close-cell" />
                    <text x={cellCenter(close)[0]} y={cellCenter(close)[1] + 12} className="close-glyph">
                        ×
                    </text>
                </svg>
            </button>

            {/* keyed by project, so its contents fade in again when ◀ ▶ swaps it */}
            <div key={project.name} className="display-content">
                <div className="display-title" style={place(boxes.title)}>
                    <h2 ref={titleRef}>{project.name}</h2>
                </div>
                <div className="display-link" style={place(boxes.link)}>
                    {project.projectLink ? (
                        <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                            {link} ↗
                        </a>
                    ) : (
                        <span className="pending" title="link coming soon">
                            {link}
                        </span>
                    )}
                </div>
                <div ref={descriptionRef} className="display-description" style={place(boxes.description)}>
                    {project.description.map((point, i) => (
                        <p key={i} style={{ "--step": Math.min(i, 4) } as CSSProperties}>
                            {point}
                        </p>
                    ))}
                </div>
                <div className="display-image" style={place(boxes.image)}>
                    <Image
                        src={`/internal-images/${project.image}`}
                        alt={project.imageAlt}
                        fill
                        sizes={`${Math.round(boxes.image.right - boxes.image.left)}px`}
                        style={{ objectFit: "contain" }}
                    />
                </div>
                <p className="display-caption" style={place(boxes.caption)}>
                    {project.caption}
                </p>
                <p className="display-skills" style={place(boxes.skills)}>
                    {project.skills.join("  ✧  ")}
                </p>
                <div className="display-tab" style={place(boxes.languages)}>
                    <span className="chip" title={project.language}>
                        <svg
                            viewBox="0 0 100 100"
                            width="15"
                            height="15"
                            aria-hidden="true"
                            // the language's own colors here, not the stone's two tones
                            dangerouslySetInnerHTML={{ __html: languageIcon }}
                        />
                        {project.language}
                    </span>
                </div>
                <div className="display-tab" style={place(boxes.type)}>
                    <span className="chip type">{CATEGORIES[project.category].name}</span>
                </div>
            </div>
        </div>
    );
}
