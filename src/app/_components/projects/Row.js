import { useState } from "react";
import ExpandedBox from "./ExpandedBox";
import SummaryBox from "./SummaryBox";

export default function Row({ projects }) {

    const [expanded, setExpanded] = useState(false);
    const [expandedProject, setExpandedProject] = useState(0);

    const getExpansionFunction = (index) => {
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
        <div className="flex flex-row flex-grow w-[90vw]">
            {expanded && <ExpandedBox project={projects[expandedProject]} compress={getCompressionFunction()} />}
            {!expanded && projects.map((project, index) => (
                <SummaryBox project={project} key={index} expand={getExpansionFunction(index)} />
            ))}
        </div>
    );
}