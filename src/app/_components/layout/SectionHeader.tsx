interface SectionHeaderProps {
    title: string;
    /**
     * heading level, for semantics only; h1 and h2 share a size. Use "h1"
     * when this header is the page's title, as on /about and /notes.
     */
    as?: "h1" | "h2";
}

/** Bagnard title, then a hairline that eats the remaining width */
export default function SectionHeader({ title, as: Heading = "h2" }: SectionHeaderProps) {
    return (
        <div className="flex w-full items-center gap-6">
            <Heading>{title}</Heading>
            <span className="h-px flex-1" style={{ background: "var(--hairline)" }} />
        </div>
    );
}
