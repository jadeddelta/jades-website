/* 
trail colors duplicated from globals.css, as literals: 
the dot mask is serialized into an SVG data URI where 
custom properties do not resolve, and the painter writes 
them on a hot path. 
*/

export const JADE = '#35e6a4';
export const JADE_BRIGHT = '#b8ffe4';
export const JADE_RGB = '53,230,164';

/** how hard the resting mesh glows */
export const NEON = {
  subtle: 0.5,
  medium: 0.9,
  full: 1.35,
} as const;

export type NeonLevel = keyof typeof NEON
