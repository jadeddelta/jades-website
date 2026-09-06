import { useState } from "react";
import ExpandedBox from "./ExpandedBox";
import SummaryBox from "./SummaryBox";
import type { Project } from "./ProjectList";

interface RowProps {
    projects: Project[];
}

export default function Row({ projects }: RowProps) {

    const [expanded, setExpanded] = useState(false);
    const [expandedProject, setExpandedProject] = useState(0);

    const getExpansionFunction = (index: number) => {
        return () => {
            setExpanded(true);
            setExpandedProject(index);
        }
    }

    const getCompressionFunction = () => {
        return () => {
            setExpanded(false);
        }
    }

    return (
        <div className="flex flex-row grow w-[90vw]">
            {expanded && <ExpandedBox project={projects[expandedProject]} compress={getCompressionFunction()} />}
            {!expanded && projects.map((project, index) => (
                <SummaryBox project={project} key={index} expand={getExpansionFunction(index)} />
            ))}
        </div>
    );
}