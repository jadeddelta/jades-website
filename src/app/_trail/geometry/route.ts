import type { SectionId } from '../../_sections/sections';
import type { Waypoint } from '../types';

const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));

/** main is our special section: this one comes from the left and tracks down */
export const HERO_SECTION: SectionId = 'main';

/**
 * creates the route of the ribbon through the page, scaled by `pageWidth`. 
 * returns a map with waypoints for each SectionId of the website, being read 
 * top to bottom. `TrailAnchor`s are declared inline.
 */
export function buildRoute(pageWidth: number): Record<SectionId, Waypoint[]> {
  /* default band half-width, and the much wider hero band */
  const HALF_WIDTH = clamp(pageWidth * 0.125, 105, 190);
  const HERO = clamp(pageWidth * 0.3, 200, 450);

  /* the three lanes the ribbon settles into, as fractions of page width */
  const LEFT = 0.17;
  const MID = 0.5;
  const RIGHT = 0.82;

  const wp = (at: number, x: number, halfWidth: number): Waypoint => ({ at, x, halfWidth });

  return {
    // enters off-screen left, sweeps in and narrows as it leaves the hero
    main: [wp(0, -0.24, HERO), wp(0.34, 0.1, HERO), wp(0.68, 0.28, HERO * 0.9), wp(1, 0.44, HALF_WIDTH * 1.6)],
    // holds center through the prose, then turns right for the expertise cards
    about: [wp(0, 0.44, HALF_WIDTH * 1.4), wp(0.8, MID, HALF_WIDTH), wp(1, RIGHT, HALF_WIDTH)],
    // right -> left across the card grid
    projects: [wp(0, RIGHT, HALF_WIDTH), wp(0.5, RIGHT, HALF_WIDTH), wp(1, LEFT, HALF_WIDTH)],
    // left, then resolves to center and narrows over the footer.
    work: [wp(0, LEFT, HALF_WIDTH), wp(0.5, LEFT, HALF_WIDTH), wp(1, MID, HALF_WIDTH * 0.8)],
  };
}
