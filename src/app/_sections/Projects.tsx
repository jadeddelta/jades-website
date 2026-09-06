import { projectList as data } from "../_components/projects/ProjectList";
import Row from "../_components/projects/Row";
import type { Project } from "../_components/projects/ProjectList";

export default function Projects() {

    const getRows = (projects: Project[]): Project[][] => {
        const rows: Project[][] = [];
        let currentRow: Project[] = [];
        let count = 0;
        
        for (let i = 0; i < projects.length; i++) {
            const projectCount = projects[i].major ? 2 : 1;

            if (count + projectCount <= 3) {
                currentRow.push(projects[i]);
                count += projectCount;

                if (count === 3) {
                    rows.push(currentRow);
                    currentRow = [];
                    count = 0;
                }
            }
        }

        return rows;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full py-16 gap-4" id="projects">
            <h2>projects</h2>
            <p className="text-lg">
                tap on a project to learn more!
            </p>
            {
            getRows(data).map((row, index) => (
                <Row projects={row} key={index} />
            ))}
        </div>
    );
}