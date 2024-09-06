import { projectList as data } from "../_components/projects/ProjectList";
import Row from "../_components/projects/Row";

export default function Projects() {
    return (
        <div className="flex flex-col items-center justify-center w-full py-16 gap-4" id="projects">
            <h2>projects</h2>
            <p className="text-lg">
                tap on a project to learn more!
            </p>
            {data.map((row, index) => (
                <Row projects={row} key={index} />
            ))}
        </div>
    );
}