import type { Metadata } from "next";
import Row from "../_components/projects/Row";
import { projects } from "../_content/projects";
import type { Project } from "../_content/projects";

export const metadata: Metadata = {
    title: "projects",
    description: "projects by jadeddelta, from research tooling to games",
};

/** packs projects into rows 3 columns wide, where a major project takes 2 */
function packRows(list: Project[]): Project[][] {
    const rows: Project[][] = [];
    let row: Project[] = [];
    let used = 0;

    for (const project of list) {
        const width = project.major ? 2 : 1;

        if (used + width > 3) {
            rows.push(row);
            row = [];
            used = 0;
        }

        row.push(project);
        used += width;
    }

    if (row.length > 0) {
        rows.push(row);
    }

    return rows;
}

export default function ProjectsPage() {
    // the trail finds this section by its id, listed in _pages/projects.ts
    return (
        <div className="page-inset flex flex-col items-center justify-center w-full py-16 gap-4" id="projects">
            <h1>projects</h1>
            <p className="text-lg">tap on a project to learn more!</p>
            {packRows(projects).map((row, index) => (
                <Row projects={row} key={index} />
            ))}
        </div>
    );
}
