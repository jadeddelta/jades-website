import { useEffect, useRef } from "react";

/*
 * the page scrolls for the display as little as it can:
 *  1. opening a project scrolls only if the display doesn't already fit in the
 *     window below the nav, and then only as far as it has to (the test is the
 *     window's height, never its width)
 *  2. closing glides back to where the reader was, unless they scrolled by hand
 *     in between
 */

const MARGIN = 16;
const behavior = (): ScrollBehavior => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

/**
 * tries to scroll the page as little as it can, by nudging the display down to fit the project
 * display, and then going back up once closing out. does not glide if the project display is
 * completely visible within the bounds of the window
 */
export function useDisplayScroll() {
    /** where the reader was when the display opened, and whether either of us has moved since */
    const memo = useRef<{ from: number; moved: boolean; manual: boolean } | null>(null);
    /** where the page is scrolling itself to, while it is */
    const target = useRef<number | null>(null);
    /** where the page last came to rest on its own */
    const rest = useRef(0);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        // moving away from where the page came to rest counts as the reader scrolling
        const onScroll = () => {
            if (target.current !== null) {
                if (Math.abs(scrollY - target.current) < 2) {
                    rest.current = target.current;
                    target.current = null;
                }
                return;
            }
            if (memo.current && Math.abs(scrollY - rest.current) > 2) memo.current.manual = true;
        };
        addEventListener("scroll", onScroll, { passive: true });
        return () => {
            removeEventListener("scroll", onScroll);
            clearTimeout(timer.current);
        };
    }, []);

    const glideTo = (y: number) => {
        target.current = Math.round(Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight)));
        window.scrollTo({ top: target.current, behavior: behavior() });
        clearTimeout(timer.current);
        // in case the scroll is cut short and never reaches its target
        timer.current = setTimeout(() => {
            if (target.current === null) return;
            target.current = null;
            rest.current = scrollY;
        }, 1200);
    };

    return {
        /** call when the display opens; top and bottom in document px */
        reveal(top: number, bottom: number) {
            const navBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
            const viewTop = scrollY + navBottom + MARGIN;
            const viewBottom = scrollY + innerHeight - MARGIN;
            let y: number | null = null;
            // too tall, or above: line its top up under the nav; below: bring its bottom up
            if (bottom - top > viewBottom - viewTop || top < viewTop) y = top - navBottom - MARGIN;
            else if (bottom > viewBottom) y = bottom - innerHeight + MARGIN;
            memo.current = { from: scrollY, moved: y !== null, manual: false };
            rest.current = scrollY;
            if (y !== null) glideTo(y);
        },
        /** call when the display closes */
        restore() {
            const m = memo.current;
            memo.current = null;
            if (m && m.moved && !m.manual) glideTo(m.from);
        },
    };
}
