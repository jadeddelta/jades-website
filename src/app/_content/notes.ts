import type { ComponentType } from "react";

/**
 * one written piece, done via a written component rather than a markdown file
 *
 * to add one: write the body component next to this file, then add an entry
 * here. The index page and the individual post route both read this list, and
 * the routes are generated from it at build time.
 *
 */
export interface Note {
    /** url segment: /notes/<slug> */
    slug: string;
    title: string;
    /** ISO date, e.g. "2026-09-24", rendered in mono */
    date: string;
    /** one line shown on the index */
    summary: string;
    Body: ComponentType;
}

export const notes: Note[] = [];

export const findNote = (slug: string): Note | undefined => notes.find((note) => note.slug === slug);

/** notes for listing, newest first. ISO dates sort correctly as plain strings. */
export const notesNewestFirst = (): Note[] => [...notes].sort((a, b) => b.date.localeCompare(a.date));
