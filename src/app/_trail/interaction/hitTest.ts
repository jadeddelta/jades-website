import { ROW_H, SIDE } from "../geometry/lattice";
import type { Tile } from "../types";

/** beyond this, the cursor isn't really over any tile */
const MAX_REACH = SIDE * 0.62;

/**
 * nearest tile look-up row-bucketed, so we look at only the closest tiles
 * rather than scanning over the hundreds of tiles we are generating
 */
export interface HitIndex {
    nearest: (x: number, y: number) => Tile | null;
}

export function createHitIndex(tiles: Tile[]): HitIndex {
    const buckets = new Map<number, Tile[]>();
    for (const tile of tiles) {
        const row = Math.floor(tile.cy / ROW_H);
        const bucket = buckets.get(row);
        if (bucket) bucket.push(tile);
        else buckets.set(row, [tile]);
    }

    const span = Math.ceil(MAX_REACH / ROW_H);

    const nearest = (x: number, y: number): Tile | null => {
        const row = Math.floor(y / ROW_H);
        let best: Tile | null = null;
        let bestDistance = MAX_REACH * MAX_REACH;
        for (let r = row - span; r <= row + span; r++) {
            const bucket = buckets.get(r);
            if (!bucket) continue;
            for (const tile of bucket) {
                const d = (tile.cx - x) ** 2 + (tile.cy - y) ** 2;
                if (d < bestDistance) {
                    bestDistance = d;
                    best = tile;
                }
            }
        }
        return best;
    };

    return { nearest };
}
