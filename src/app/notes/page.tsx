import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "../_components/layout/SectionHeader";
import { notes, notesNewestFirst } from "../_content/notes";

export const metadata: Metadata = {
    title: "notes",
    description: "musings from a person with a pixel bunny profile pic",
};

export default function Notes() {
    // the trail finds this section by its id, listed in _pages/notes.ts
    return (
        <section id="top" className="prose-column flex flex-col gap-10">
            <SectionHeader as="h1" title="notes" />
            {notes.length === 0 ? (
                <p className="font-mono text-[14px] leading-[1.8] text-mono-dim">
                    nothing written yet. check back soon!
                </p>
            ) : (
                <ul className="flex flex-col gap-8">
                    {notesNewestFirst().map((note) => (
                        <li key={note.slug}>
                            <Link
                                href={`/notes/${note.slug}`}
                                className="group flex flex-col gap-2 border-l border-jade/35 pl-5 transition-colors hover:border-jade"
                            >
                                <span className="font-mono text-[12px] tracking-[0.14em] text-mono-dim">
                                    {note.date}
                                </span>
                                <span className="font-display text-[24px] text-ink transition-colors group-hover:text-jade-bright">
                                    {note.title}
                                </span>
                                <span className="text-[15px] leading-[1.7] text-dim">{note.summary}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
