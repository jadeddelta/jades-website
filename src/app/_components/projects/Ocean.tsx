"use client";

import { useEffect, useRef, useState } from "react";
import { ROW_H } from "../../_trail/geometry/lattice";
import { vertexPoint } from "../../_trail/geometry/shapes";
import type { Point } from "../../_trail/geometry/shapes";
import { pulseTrail, remeasureTrail } from "../../_trail/events";
import { CATEGORIES, LANGUAGES } from "../../_content/projects";
import type { Category, Language, Project } from "../../_content/projects";
import Display from "./Display";
import FilterHex from "./FilterHex";
import type { FilterOption } from "./FilterHex";
import Stone from "./Stone";
import type { StoneIcons } from "./Stone";
import { layoutDisplay, oceanBottom, oceanHeader, oceanSlots } from "./layout";
import { useDisplayScroll } from "./useDisplayScroll";
import { usePlacement } from "../layout/usePlacement";
import "./ocean.css";

const JADE = "53,230,164";
/** how long the display takes to fold away, ms */
const FOLD_TIME = 950;

interface OceanProps {
    stones: { project: Project; icons: StoneIcons }[];
    languageIcons: Record<Language, string>;
}

/**
 * the projects: two filter hexagons over an ocean of stones, everything sitting
 * on the trail's lattice. picking a stone sinks it, sends a ring through the
 * trail and raises the project's display over the ocean.
 */
export default function Ocean({ stones, languageIcons }: OceanProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const { width, top } = usePlacement(sectionRef);
    const [languages, setLanguages] = useState(new Set<string>());
    const [types, setTypes] = useState(new Set<string>());

    /** which project is open (but `closing` holds it when folding away) */
    const [open, setOpen] = useState<number | null>(null);
    const [closing, setClosing] = useState<{ index: number; key: number } | null>(null);
    /** a new display key for each fresh open, remains the same on arrow buttons or on close */
    const [session, setSession] = useState(0);
    const [origin, setOrigin] = useState<Point>([0, 0]);
    const [ring, setRing] = useState<{ x: number; y: number; key: number }>();
    const count = useRef(0);
    const foldTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const scroll = useDisplayScroll();

    const shown = (project: Project) =>
        (languages.size === 0 || languages.has(project.language)) && (types.size === 0 || types.has(project.category));
    const shownCount = stones.filter(({ project }) => shown(project)).length;
    const toggle = (set: Set<string>, update: (next: Set<string>) => void) => (id: string) => {
        const next = new Set(set);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        update(next);
    };

    // --- all positions ---
    const base = Math.ceil(top / ROW_H) - 1;
    const header = oceanHeader(width, base);
    const { slots, rows } = oceanSlots(width, stones.length, header.firstRow);
    // the display's top row is level with the first stones' tops, where the trail meets it
    const display = layoutDisplay(width, header.firstRow - 1);
    const displayTop = display.r0 * ROW_H;
    const displayBottom = (display.r0 + display.spec.R) * ROW_H;
    const bottom = oceanBottom(header.firstRow, rows, display);

    // the trail measures its markers (below); tell it when they've moved
    useEffect(() => {
        if (width) remeasureTrail();
    }, [width, top, bottom]);
    useEffect(() => () => clearTimeout(foldTimer.current), []);

    const centerOf = (i: number) => vertexPoint(slots[i]);

    const select = (i: number) => {
        if (open !== null) {
            if (i !== open) switchTo(i, 1);
            return;
        }
        // picked again while the last display is still folding: drop it at once
        clearTimeout(foldTimer.current);
        setClosing(null);
        setSession((s) => s + 1);
        setRing(undefined);
        const [x, y] = centerOf(i);
        setOrigin([x, y]);
        setOpen(i);
        pulseTrail(x, y, CATEGORIES[stones[i].project.category].rgb);
        scroll.reveal(displayTop, displayBottom);
    };

    const switchTo = (i: number, dir: number) => {
        setOpen(i);
        const [x, y] = vertexPoint(dir < 0 ? display.arrows.left : display.arrows.right);
        setRing({ x, y, key: ++count.current });
    };

    /** steps the current project by dir amount, corresponding to left/right arrow button/key */
    const stepBy = (dir: number) => {
        if (open === null) return;
        const visible = stones.flatMap(({ project }, i) => (shown(project) ? [i] : []));
        if (!visible.length) return;
        const at = Math.max(0, visible.indexOf(open));
        switchTo(visible[(at + dir + visible.length) % visible.length], dir);
    };

    const close = () => {
        if (open === null) return;
        const i = open;
        const focusInside = !!document.activeElement?.closest(".display");
        setOpen(null);
        const key = ++count.current;
        setClosing({ index: i, key });
        // the stone comes straight back up, so it can be picked again while the display folds
        pulseTrail(...centerOf(i));
        scroll.restore();
        if (focusInside) {
            const name = CSS.escape(stones[i].project.name);
            document.querySelector<HTMLElement>(`[data-project="${name}"]`)?.focus({ preventScroll: true });
        }
        clearTimeout(foldTimer.current);
        foldTimer.current = setTimeout(() => setClosing((c) => (c?.key === key ? null : c)), FOLD_TIME);
    };

    // keybinds if a project is open
    useEffect(() => {
        if (open === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowLeft") stepBy(-1);
            else if (e.key === "ArrowRight") stepBy(1);
        };
        const onClick = (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (target?.closest(".display, .stone, .filter-hex, .ocean-counter, header, a, button")) return;
            close();
        };
        addEventListener("keydown", onKey);
        addEventListener("click", onClick);
        return () => {
            removeEventListener("keydown", onKey);
            removeEventListener("click", onClick);
        };
    });

    const languageOptions: (FilterOption | null)[] = [
        LANGUAGES[0],
        LANGUAGES[1],
        LANGUAGES[2],
        LANGUAGES[3],
        LANGUAGES[4],
        null,
    ].map((language) => (language ? { id: language, name: language, rgb: JADE, icon: languageIcons[language] } : null));
    const typeOptions: FilterOption[] = (Object.keys(CATEGORIES) as Category[]).map((id) => ({
        id,
        name: CATEGORIES[id].name,
        rgb: CATEGORIES[id].rgb,
    }));

    const displayed = open ?? closing?.index ?? null;

    return (
        <section
            ref={sectionRef}
            className={"ocean relative w-full" + (open !== null ? " reading" : "")}
            style={{ height: width ? bottom - top : undefined, minHeight: width ? undefined : "80vh" }}
        >
            <h1 className="pt-3 text-center">projects</h1>
            {width > 0 && (
                <>
                    {/* the trail finds these by id, listed in _pages/projects.ts: in from the top, then through the ocean */}
                    <div id="projects-inflow" className="trail-marker" style={{ top: 0, height: displayTop - top }} />
                    <div
                        id="projects-ocean"
                        className="trail-marker"
                        style={{ top: displayTop - top, height: bottom - displayTop }}
                    />

                    <FilterHex
                        title="language"
                        center={header.languageFilter}
                        originY={top}
                        options={languageOptions}
                        active={languages}
                        onToggle={toggle(languages, setLanguages)}
                    />
                    <FilterHex
                        title="field"
                        center={header.typeFilter}
                        originY={top}
                        options={typeOptions}
                        active={types}
                        onToggle={toggle(types, setTypes)}
                    />
                    <p className="ocean-counter" style={{ top: header.counterY - top }}>
                        {shownCount} of {stones.length} stones
                        {(languages.size > 0 || types.size > 0) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setLanguages(new Set());
                                    setTypes(new Set());
                                }}
                            >
                                clear
                            </button>
                        )}
                    </p>

                    {stones.map(({ project, icons }, i) => (
                        <Stone
                            key={project.name}
                            project={project}
                            icons={icons}
                            center={slots[i]}
                            originY={top}
                            dim={!shown(project)}
                            sunk={open === i}
                            onSelect={() => select(i)}
                        />
                    ))}

                    {displayed !== null && (
                        <Display
                            key={session}
                            project={stones[displayed].project}
                            languageIcon={languageIcons[stones[displayed].project.language]}
                            layout={display}
                            width={width}
                            originY={top}
                            origin={origin}
                            closingToward={open === null && closing ? centerOf(closing.index) : undefined}
                            ring={ring}
                            onPrev={() => stepBy(-1)}
                            onNext={() => stepBy(1)}
                            onClose={close}
                        />
                    )}
                </>
            )}
        </section>
    );
}
