"use client";

import { useState } from "react";
import ExpandedBox from "./ExpandedBox";
import SummaryBox from "./SummaryBox";
import type { Project } from "../../_content/projects";

interface RowProps {
    projects: Project[];
}

export default function Row({ projects }: RowProps) {
    // index of the project shown expanded, or null while the row shows summaries
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-row grow w-full">
            {openIndex !== null ? (
                <ExpandedBox project={projects[openIndex]} compress={() => setOpenIndex(null)} />
            ) : (
                projects.map((project, index) => (
                    <SummaryBox project={project} key={index} expand={() => setOpenIndex(index)} />
                ))
            )}
        </div>
    );
}
