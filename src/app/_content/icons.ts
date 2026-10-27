import fs from "node:fs";
import path from "node:path";
import type { Project } from "./projects";

const ICON_DIR = path.join(process.cwd(), "src/app/_content/icons");

/** an get the svg icon in a string */
export function loadIcon(name: string): string {
    return fs.readFileSync(path.join(ICON_DIR, `${name}.svg`), "utf8");
}

/** get all three icons for a stone, keyed by language/wildcard/project */
export function stoneIcons(project: Project) {
    return {
        language: loadIcon(project.language),
        wildcard: loadIcon(project.wildcardSvg),
        project: loadIcon(project.projectSvg),
    };
}
