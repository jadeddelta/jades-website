export interface PulseDetail {
    /** in document px */
    x: number;
    y: number;
    /** "r,g,b"; the trail's jade if left out */
    rgb?: string;
}

export const PULSE_EVENT = "trail:pulse";
export const REMEASURE_EVENT = "trail:remeasure";

/** send a ring through the trail from a point */
export function pulseTrail(x: number, y: number, rgb?: string) {
    window.dispatchEvent(new CustomEvent<PulseDetail>(PULSE_EVENT, { detail: { x, y, rgb } }));
}

/** ask the trail to measure its sections again, after the page moved them without resizing */
export function remeasureTrail() {
    window.dispatchEvent(new Event(REMEASURE_EVENT));
}
