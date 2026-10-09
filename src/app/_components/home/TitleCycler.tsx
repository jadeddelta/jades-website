"use client";

import { useState } from "react";

interface TitleCyclerProps {
    titles: readonly string[];
}

export default function TitleCycler({ titles }: TitleCyclerProps) {
    const [index, setIndex] = useState(0);

    const step = (delta: number) => {
        setIndex((current) => (current + delta + titles.length) % titles.length);
    };

    return (
        <div className="flex w-full items-center gap-3 drop-shadow-[0_0_14px_rgba(5,9,8,0.45)] lg:pl-[33%]">
            <button
                type="button"
                aria-label="previous title"
                onClick={() => step(-1)}
                className="group -ml-1 shrink-0 p-1"
            >
                <span className="block h-0 w-0 border-y-[9px] border-r-[14px] border-y-transparent border-r-jade transition-colors group-hover:border-r-jade-bright" />
            </button>
            <span
                aria-live="polite"
                className="min-w-0 flex-1 whitespace-nowrap text-center text-[clamp(18px,1.8vw,24px)] text-ink hero-shade-strong"
            >
                {titles[index]}
            </span>
            <button type="button" aria-label="next title" onClick={() => step(1)} className="group -mr-1 shrink-0 p-1">
                <span className="block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-jade transition-colors group-hover:border-l-jade-bright" />
            </button>
        </div>
    );
}
