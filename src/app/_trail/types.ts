import type { SectionId } from '../_sections/sections';

/** a cell in the triangular lattice: row `r` from the document top, column `k` per half of triangle. */
export interface Cell {
  r: number
  k: number
}

/** `${r}:${k}` — the working key while carving. Not stable across reflow. */
export type CellKey = string

/** unique identity for every tile of form `${section}:${rowInSection}:${k}`. */
export type TileId = string

export interface Tile {
  id: TileId
  /** section the centroid is closest to */
  section: SectionId
  r: number
  k: number
  /** `points` attribute for <polygon> */
  points: string
  /** centroid x, in document coordinates */
  cx: number
  /** centroid y, in document coordinates */
  cy: number
  /** resting opacity before neon multiplier */
  opacity: number
}

/** waypoint on the trail, used to guide it */
export interface Waypoint {
  /** fraction of the section's measured height (0 = top, 1 = bottom) */
  at: number
  /** center of the band, as a fraction of page width (negative = offscreen) */
  x: number
  /** half-width of the band, in px */
  halfWidth: number
}

/** section box, measured against the trail host element */
export interface SectionBox {
  id: SectionId
  top: number
  height: number
}

/** spine of the ribbon, sampled from the route */
export interface Centerline {
  /** center x at document y */
  xAt: (y: number) => number
  /** half-width at document y */
  hwAt: (y: number) => number
  /** polygon points tracing the band's outline, for the dot-field mask */
  outline: (height: number) => string
}

export interface TrailGeometry {
  tiles: Tile[]
  width: number
  height: number
  ribbon: string
}
