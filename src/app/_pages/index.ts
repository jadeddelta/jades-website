import type { PageConfig } from "./pageConfig";
import { homePage } from "./home";
import { projectsPage } from "./projects";
import { workPage } from "./work";
import { aboutPage } from "./about";
import { notesPage } from "./notes";
import { findNote } from "../_content/notes";

/**
 * every kind of page, keyed by path. to add a kind of page, write the file next in this dir, then add the config here
 */
const PAGES = new Map<string, PageConfig>([
    ["/", homePage],
    ["/projects", projectsPage],
    ["/work", workPage],
    ["/about", aboutPage],
    ["/notes", notesPage],
]);

/**
 * returns the config for the page at this path, or undefined on a 404, which gets no
 * trail. only real pages match: the 404 page is prerendered once with no trail.
 */
export function pageConfigFor(pathname: string): PageConfig | undefined {
    // a note's own page shares the notes config
    const slug = pathname.match(/^\/notes\/([^/]+)$/)?.[1];
    if (slug) return findNote(slug) ? notesPage : undefined;

    return PAGES.get(pathname);
}
