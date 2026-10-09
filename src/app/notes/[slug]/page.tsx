import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findNote, notes } from "../../_content/notes";

interface NotePageProps {
    params: Promise<{ slug: string }>;
}

/** every post is known at build time, so every route is static */
export function generateStaticParams() {
    return notes.map((note) => ({ slug: note.slug }));
}

/** a slug that is not in the list is a plain 404, not rendered on request */
export const dynamicParams = false;

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
    const { slug } = await params;
    const note = findNote(slug);
    if (!note) return {};
    return { title: note.title, description: note.summary };
}

export default async function NotePage({ params }: NotePageProps) {
    const { slug } = await params;
    const note = findNote(slug);
    if (!note) notFound();

    const { Body } = note;

    // the trail finds this section by its id, listed in _pages/notes.ts
    return (
        <article id="top" className="prose-column flex flex-col gap-8">
            <header className="flex flex-col gap-3">
                <span className="font-mono text-[12px] tracking-[0.14em] text-mono-dim">{note.date}</span>
                <h1>{note.title}</h1>
            </header>
            <div className="prose-text flex flex-col gap-6">
                <Body />
            </div>
            <Link
                href="/notes"
                className="font-mono text-[13px] tracking-[0.14em] text-jade transition-colors hover:text-jade-bright"
            >
                {"< all notes"}
            </Link>
        </article>
    );
}
