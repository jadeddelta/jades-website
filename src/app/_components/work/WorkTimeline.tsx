"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ROW_H } from "../../_trail/geometry/lattice";
import type { Point } from "../../_trail/geometry/shapes";
import { pulseTrail, remeasureTrail } from "../../_trail/events";
import { projects } from "../../_content/projects";
import type { Project } from "../../_content/projects";
import { timeline } from "../../_content/work";
import Display from "../projects/Display";
import { layoutDisplay } from "../projects/layout";
import { displayRow, useDisplayScroll } from "../projects/useDisplayScroll";
import { usePlacement } from "../layout/usePlacement";
import { stableHtml } from "../stableHtml";
import JobStone from "./JobStone";
import { workLayout } from "./layout";
// import display styles from the project's ocean
import "../projects/ocean.css";
import "./work.css";

/** how long the display takes to fold away in ms (as on the projects page) */
const FOLD_TIME = 950;

const byName = new Map(projects.map((project) => [project.name, project]));
/** list of job rhombi, null means no project and will be inert gray square */
const rhombi = timeline.map((job) => [0, 1, 2].map((slot) => byName.get(job.projects[slot]) ?? null));

interface WorkTimelineProps {
    /** svg markup by item name */
    icons: Record<string, string>;
}

interface Opened {
    job: number;
    project: Project;
    origin: Point;
    r0: number;
}

/**
 * the work history, ordered most recent first with a stone describing each position,
 * and each rhombus having a project worked on during that job
 */
export default function WorkTimeline({ icons }: WorkTimelineProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const { width, top } = usePlacement(sectionRef);

    // job text is measured and the next stone is placed below it with the titles, so every title line fits the widest
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [heights, setHeights] = useState<number[]>(() => timeline.map(() => 320));
    const [titleWidth, setTitleWidth] = useState(0);
    useLayoutEffect(() => {
        const titles = [...(sectionRef.current?.querySelectorAll<HTMLElement>(".job-title h2") ?? [])];
        const measure = () => {
            setHeights((now) => {
                const next = now.map((h, i) => textRefs.current[i]?.offsetHeight ?? h);
                return now.every((h, i) => h === next[i]) ? now : next;
            });
            setTitleWidth(Math.max(0, ...titles.map((h) => h.offsetWidth)));
        };
        measure();
        const observer = new ResizeObserver(measure);
        [...textRefs.current, ...titles].forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [width]);

    const { places, end } = workLayout(width, top, heights, titleWidth);

    // the trail works out the same column from the page width (see _pages/work.ts); tell it when things moved
    useEffect(() => {
        if (width) remeasureTrail();
    }, [width, top, end]);

    /** the rhombus pointed at, in one job */
    const [hover, setHover] = useState<{ job: number; project: string } | null>(null);

    const [open, setOpen] = useState<Opened | null>(null);
    const [closing, setClosing] = useState<{ opened: Opened; key: number } | null>(null);
    /** a new display key for each open */
    const [session, setSession] = useState(0);
    const count = useRef(0);
    const foldTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const scroll = useDisplayScroll();
    useEffect(() => () => clearTimeout(foldTimer.current), []);

    const pick = (job: number, project: Project, origin: Point) => {
        clearTimeout(foldTimer.current);
        setClosing(null);
        const R = layoutDisplay(width, 0).spec.R;
        const r0 = displayRow(R);
        setSession((s) => s + 1);
        setOpen({ job, project, origin, r0 });
        pulseTrail(origin[0], origin[1], project.rgb);
        scroll.reveal(r0 * ROW_H, (r0 + R) * ROW_H);
    };

    const close = () => {
        if (!open) return;
        const was = open;
        const focusInside = !!document.activeElement?.closest(".display");
        setOpen(null);
        // the rhombus gets focus back below, but only a keyboard user should see it lit by that
        setHover(null);
        const key = ++count.current;
        setClosing({ opened: was, key });
        pulseTrail(was.origin[0], was.origin[1]);
        scroll.restore();
        if (focusInside) {
            const name = CSS.escape(`${timeline[was.job].startDate}|${was.project.name}`);
            document.querySelector<SVGGElement>(`[data-rhombus="${name}"]`)?.focus({ preventScroll: true });
        }
        foldTimer.current = setTimeout(() => setClosing((c) => (c?.key === key ? null : c)), FOLD_TIME);
    };

    // keybinds and click-off while a project is open
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        const onClick = (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (target?.closest(".display, .rhombus-button, header, a, button")) return;
            close();
        };
        addEventListener("keydown", onKey);
        addEventListener("click", onClick);
        return () => {
            removeEventListener("keydown", onKey);
            removeEventListener("click", onClick);
        };
    });

    const shown = open ?? closing?.opened ?? null;
    const displayLayout = shown ? layoutDisplay(width, shown.r0) : null;

    return (
        // the trail finds this section by its id, listed in _pages/work.ts
        <section
            ref={sectionRef}
            id="work"
            className={"work relative w-full" + (open ? " reading" : "")}
            style={{ height: width ? end - top : undefined, minHeight: width ? undefined : "80vh" }}
        >
            <h1 className="pt-3 text-center">professional experience</h1>
            {width > 0 &&
                timeline.map((job, i) => {
                    const place = places[i];
                    const litHere = hover?.job === i ? hover.project : null;
                    // only points about that project light up, so if none are, nothing dims
                    const anyPoint = !!litHere && job.points.some((point) => point.project === litHere);
                    return (
                        <div
                            key={job.startDate}
                            className={"job" + (litHere ? " pointing" : "") + (anyPoint ? " lights-points" : "")}
                        >
                            <JobStone
                                job={job}
                                rhombi={rhombi[i]}
                                place={place}
                                icons={icons}
                                originY={top}
                                lit={litHere}
                                picked={open?.job === i ? open.project.name : null}
                                onHover={(project) => setHover(project ? { job: i, project } : null)}
                                onPick={(project, origin) => pick(i, project, origin)}
                            />
                            <div
                                ref={(el) => {
                                    textRefs.current[i] = el;
                                }}
                                className="job-text"
                                style={{ left: place.text.left, top: place.text.top - top, width: place.text.width }}
                            >
                                <p className="job-lead">{job.description.trim()}</p>
                                <ul className="job-points">
                                    {job.points.map((point, p) => {
                                        const project = point.project ? byName.get(point.project) : undefined;
                                        return (
                                            <li
                                                key={p}
                                                className={
                                                    (project ? "linked" : "") +
                                                    (project && litHere === project.name ? " lit" : "")
                                                }
                                                style={project ? ({ "--c": project.rgb } as CSSProperties) : undefined}
                                                // point is a hardcoded string, so XSS is not a concern
                                                dangerouslySetInnerHTML={stableHtml(point.html)}
                                            />
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })}

            {shown && displayLayout && (
                // uses project's own color, and with no left to right buttons
                <Display
                    key={session}
                    project={shown.project}
                    languageIcon={icons[shown.project.language]}
                    layout={displayLayout}
                    width={width}
                    originY={top}
                    origin={shown.origin}
                    closingToward={!open && closing ? closing.opened.origin : undefined}
                    rgb={shown.project.rgb}
                    // no sinking b/c no stone to sink, so quicker
                    lead={65}
                    onClose={close}
                />
            )}
        </section>
    );
}
