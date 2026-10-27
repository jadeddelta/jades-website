/** marks whose main shape is their darker color (swap tones) */
const SWAPPED_MARKS = new Set(["githubactions"]);

/** get the two tones for a given rgb value (r,g,b), 46% dark and 40% light looks best! */
export function tonesFor(rgb: string) {
    const channels = rgb.split(",").map(Number);
    const dark = channels.map((c) => Math.round(c * 0.46));
    const light = channels.map((c) => Math.round(c + (255 - c) * 0.4));
    return { dark: `rgb(${dark.join(", ")})`, light: `rgb(${light.join(", ")})` };
}

const NAMED: Record<string, number[]> = { white: [255, 255, 255], black: [0, 0, 0] };

/** returns a three number array corresponding to r, g, b from a CSS color value */
function parseColor(value: string): number[] {
    const v = value.trim().toLowerCase();
    if (NAMED[v]) return NAMED[v];
    const short = v.match(/^#([0-9a-f]{3})$/);
    if (short) return short[1].split("").map((c) => parseInt(c + c, 16));
    const long = v.match(/^#([0-9a-f]{6})/);
    if (long) return [0, 2, 4].map((i) => parseInt(long[1].slice(i, i + 2), 16));
    const fn = v.match(/^rgba?\(([^)]+)\)/);
    if (fn) return fn[1].split(",").slice(0, 3).map(parseFloat);
    return [0, 0, 0];
}

function luminance([r, g, b]: number[]) {
    const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

interface Paint {
    el: Element;
    prop: "fill" | "stroke";
    rgb: number[];
    lum: number;
    tone?: "dark" | "light";
}

const cache = new Map<string, string>();
let idCount = 0;

/**
 * render a colored 100x100 SVG into a two-toned SVG for a given color scheme, working out
 * the shapes, removing faint decorations like shadows, splitting the color into light
 * and dark by brightness, and coloring them into the corresponding shapes.
 *
 * @param name the internal icon name, used to cache / for `SWAPPED_MARKS`
 * @param markup the svg icon source
 * @param rgb the color to two-tone to
 */
export function twoTone(name: string, markup: string, rgb: string): string {
    const key = name + "|" + rgb;
    const hit = cache.get(key);
    if (hit) return hit;

    const tones = tonesFor(rgb);
    const root = new DOMParser().parseFromString(markup, "image/svg+xml").documentElement;

    // simple ".a { fill: #xxx }" rules from any <style> block
    const classRules: Record<string, Record<string, string>> = {};
    for (const style of root.querySelectorAll("style")) {
        for (const [, cls, body] of (style.textContent ?? "").matchAll(/\.([\w-]+)\s*\{([^}]*)\}/g)) {
            classRules[cls] = Object.fromEntries(
                body
                    .split(";")
                    .map((d) => d.split(":").map((x) => x.trim()))
                    .filter((d) => d[0] && d[1]),
            );
        }
    }

    // gradients become their average stop color and opacity
    const gradients: Record<string, { rgb: number[]; opacity: number }> = {};
    for (const grad of root.querySelectorAll("linearGradient, radialGradient")) {
        const ref = (grad.getAttribute("href") ?? grad.getAttribute("xlink:href") ?? "").replace("#", "");
        const owner = grad.querySelector("stop") ? grad : ref ? root.querySelector(`[id="${ref}"]`) : null;
        const stops = [...(owner?.querySelectorAll("stop") ?? [])].map((stop) => {
            const style = stop.getAttribute("style") ?? "";
            const color = stop.getAttribute("stop-color") ?? style.match(/stop-color:\s*([^;]+)/)?.[1] ?? "#000";
            const opacity = stop.getAttribute("stop-opacity") ?? style.match(/stop-opacity:\s*([^;]+)/)?.[1] ?? "1";
            return { rgb: parseColor(color), opacity: parseFloat(opacity) };
        });
        const id = grad.getAttribute("id");
        if (!id || !stops.length) continue;
        gradients[id] = {
            rgb: [0, 1, 2].map((i) => stops.reduce((sum, s) => sum + s.rgb[i], 0) / stops.length),
            opacity: stops.reduce((sum, s) => sum + s.opacity, 0) / stops.length,
        };
    }

    /** a property set on this element itself: inline style, then class rule, then attribute */
    const own = (el: Element, prop: string) => {
        const fromStyle = el.getAttribute("style")?.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`))?.[1];
        if (fromStyle) return fromStyle;
        for (const cls of (el.getAttribute("class") ?? "").split(/\s+/)) {
            if (classRules[cls]?.[prop]) return classRules[cls][prop];
        }
        return el.getAttribute(prop);
    };
    /** a property as inherited down the tree */
    const resolve = (el: Element, prop: string) => {
        for (let n: Element | null = el; n; n = n.parentElement) {
            const v = own(n, prop);
            if (v) return v;
        }
        return null;
    };
    const opacityOf = (el: Element) => {
        let opacity = 1;
        for (let n: Element | null = el; n; n = n.parentElement) opacity *= parseFloat(own(n, "opacity") ?? "1");
        return opacity;
    };

    const shapes = [...root.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line, text")].filter(
        (el) => !el.closest("defs, clipPath, mask, pattern, linearGradient, radialGradient, symbol"),
    );
    const paints: Paint[] = [];
    for (const el of shapes) {
        let painted = false;
        for (const prop of ["fill", "stroke"] as const) {
            const value = resolve(el, prop) ?? (prop === "fill" ? "#000" : "none");
            if (value === "none" || value === "transparent") continue;
            let color: number[];
            let alpha = opacityOf(el) * parseFloat(resolve(el, prop + "-opacity") ?? "1");
            const ref = value.match(/url\(\s*['"]?#([^)'"]+)/);
            if (ref) {
                const grad = gradients[ref[1]];
                if (!grad) continue;
                color = grad.rgb;
                alpha *= grad.opacity;
            } else color = parseColor(value);
            if (alpha < 0.35) continue;
            paints.push({ el, prop, rgb: color, lum: luminance(color) });
            painted = true;
        }
        if (!painted) el.remove();
    }

    // two groups by brightness: two-means, seeded at the darkest and lightest color
    const mono = new Set(paints.map((p) => p.rgb.map(Math.round).join(","))).size < 2;
    if (mono) for (const p of paints) p.tone = "light";
    else {
        let lo = Math.min(...paints.map((p) => p.lum));
        let hi = Math.max(...paints.map((p) => p.lum));
        const isDark = (p: Paint) => Math.abs(p.lum - lo) <= Math.abs(p.lum - hi);
        for (let round = 0; round < 8; round++) {
            const dark = paints.filter(isDark);
            const light = paints.filter((p) => !isDark(p));
            if (!dark.length || !light.length) break;
            lo = dark.reduce((sum, p) => sum + p.lum, 0) / dark.length;
            hi = light.reduce((sum, p) => sum + p.lum, 0) / light.length;
        }
        const swap = SWAPPED_MARKS.has(name);
        for (const p of paints) p.tone = isDark(p) !== swap ? "dark" : "light";
    }
    for (const p of paints) {
        (p.el as SVGElement).style.setProperty(p.prop, tones[p.tone!]);
        (p.el as SVGElement).style.setProperty(p.prop + "-opacity", "1");
        p.el.removeAttribute("opacity");
    }

    // tidy up, and give remaining ids a unique prefix so copies on one page don't collide
    root.querySelectorAll("style, linearGradient, radialGradient").forEach((n) => n.remove());
    root.querySelectorAll("[class]").forEach((n) => n.removeAttribute("class"));
    const prefix = `tt${++idCount}-`;
    for (const n of root.querySelectorAll("[id]")) n.setAttribute("id", prefix + n.getAttribute("id"));
    for (const n of root.querySelectorAll("*")) {
        for (const attr of ["clip-path", "mask", "href", "xlink:href", "fill", "stroke"]) {
            const v = n.getAttribute(attr);
            if (v?.includes("#")) n.setAttribute(attr, v.replace(/#([\w-]+)/, `#${prefix}$1`));
        }
    }

    const viewBox = root.getAttribute("viewBox") ?? "0 0 128 128";
    const size = parseFloat(viewBox.split(/[\s,]+/)[2]);
    const serializer = new XMLSerializer();
    let inner = [...root.childNodes].map((n) => serializer.serializeToString(n)).join("");
    if (mono) {
        // a dark copy of the mark, offset down-right, sits behind the light one
        const shadow = inner.split(tones.light).join(tones.dark);
        const d = size * 0.045;
        inner = `<g transform="translate(${d} ${d})">${shadow}</g>${inner}`;
    }
    const out = `<svg viewBox="${viewBox}" width="100" height="100" overflow="visible">${inner}</svg>`;
    cache.set(key, out);
    return out;
}
