import { useSyncExternalStore } from "react";
import type { RefObject } from "react";

/**
 * returns the page width and where a ref starts, in document px. pages that lay
 * things out on the trail lattice draw nothing until these are known: both are
 * 0 on the server.
 */
export function usePlacement(ref: RefObject<HTMLElement | null>) {
    const snapshot = useSyncExternalStore(
        (onChange) => {
            const observer = new ResizeObserver(onChange);
            observer.observe(document.documentElement);
            addEventListener("resize", onChange);
            return () => {
                observer.disconnect();
                removeEventListener("resize", onChange);
            };
        },
        () => (ref.current ? `${document.documentElement.clientWidth}|${ref.current.offsetTop}` : "0|0"),
        () => "0|0",
    );
    const [width, top] = snapshot.split("|").map(Number);
    return { width, top };
}
