const SPEED = 0.95; // px per ms
const BAND = 130; // px either side of the front

export interface RippleCell {
    el: SVGPolygonElement;
    x: number;
    y: number;
}

/**
 * run a ring outward from (x, y); returns a function that stops it early
 */
export function ripple(cells: RippleCell[], x: number, y: number, rgb: string): () => void {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
    const ring = cells.map((cell) => ({ ...cell, d: Math.hypot(cell.x - x, cell.y - y) })).sort((a, b) => a.d - b.d);
    const start = performance.now();
    let tail = 0;
    let frame = requestAnimationFrame(function step(now) {
        const front = (now - start) * SPEED;
        while (tail < ring.length && ring[tail].d < front - BAND) {
            ring[tail].el.style.stroke = "";
            ring[tail].el.style.filter = "";
            tail++;
        }
        for (let i = tail; i < ring.length && ring[i].d <= front + BAND; i++) {
            const k = 1 - Math.abs(ring[i].d - front) / BAND;
            ring[i].el.style.stroke = `rgba(${rgb},${(0.15 + 0.75 * k).toFixed(3)})`;
            ring[i].el.style.filter = `drop-shadow(0 0 ${(6 * k).toFixed(1)}px rgba(${rgb},.8))`;
        }
        if (tail < ring.length) frame = requestAnimationFrame(step);
    });
    return () => {
        cancelAnimationFrame(frame);
        for (const cell of ring) {
            cell.el.style.stroke = "";
            cell.el.style.filter = "";
        }
    };
}
