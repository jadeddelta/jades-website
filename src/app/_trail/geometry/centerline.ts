import { SECTION_IDS } from '../../_sections/sections';
import type { SectionId } from '../../_sections/sections';
import type { Centerline, SectionBox, Waypoint } from '../types';

interface Sample {
  y: number
  x: number
  hw: number
}

/** how far past the document the ribbon is extended, so it never ends mid-page */
const OVERSHOOT = 300;
/** vertical sampling step when tracing the band outline for the dot mask */
const OUTLINE_STEP = 26;
/** the mask is blurred, so its outline is a bit wider than the band */
const OUTLINE_SLACK = 1.12;

/**
 * resolve per-section waypoints into samples to interpolate, `x` over smoothstep
 * and `hw` linearly
 */
export function buildCenterline(
  boxes: SectionBox[],
  route: Record<SectionId, Waypoint[]>,
  pageWidth: number,
  pageHeight: number,
): Centerline | null {
  const byId = new Map(boxes.map((b) => [b.id, b]));
  const samples: Sample[] = [];

  for (const id of SECTION_IDS) {
    const box = byId.get(id);
    if (!box) continue;
    for (const { at, x, halfWidth } of route[id]) {
      const y = box.top + box.height * at;
      // adjacent sections share an edge, so the second of a coincident pair
      // would create a zero-length segment and a divide-by-zero in the lerp
      if (samples.length && y <= samples[samples.length - 1].y + 2) continue;
      samples.push({ y, x: x * pageWidth, hw: halfWidth });
    }
  }


  if (samples.length < 2) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `trail centerline got ${samples.length} samples, section might be too short?`
      );
    }
    return null;
  }

  // start + ending that goes over page
  const first = samples[0];
  const last = samples[samples.length - 1];
  samples.unshift({ y: -OVERSHOOT, x: first.x, hw: first.hw });
  samples.push({ y: pageHeight + OVERSHOOT, x: last.x, hw: last.hw * 0.6 });

  const interpolate = (y: number, pick: (s: Sample) => number, ease: boolean) => {
    if (y <= samples[0].y) return pick(samples[0]);
    for (let i = 1; i < samples.length; i++) {
      if (y <= samples[i].y) {
        const a = samples[i - 1];
        const b = samples[i];
        const t = (y - a.y) / Math.max(1, b.y - a.y);
        // smoothstep interpolation if true, linear if false
        const e = ease ? t * t * (3 - 2 * t) : t;
        return pick(a) + (pick(b) - pick(a)) * e;
      }
    }
    return pick(samples[samples.length - 1]);
  };

  const xAt = (y: number) => interpolate(y, (s) => s.x, true);
  const hwAt = (y: number) => interpolate(y, (s) => s.hw, false);

  const outline = (height: number) => {
    const left: string[] = [];
    const right: string[] = [];
    for (let y = -OVERSHOOT; y <= height + OVERSHOOT; y += OUTLINE_STEP) {
      const x = xAt(y);
      const hw = hwAt(y) * OUTLINE_SLACK;
      left.push(`${(x - hw).toFixed(1)},${y}`);
      right.push(`${(x + hw).toFixed(1)},${y}`);
    }
    right.reverse();
    return left.concat(right).join(' ');
  };

  return { xAt, hwAt, outline };
}
