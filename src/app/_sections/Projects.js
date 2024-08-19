import { projectList as data } from "../_components/projects/ProjectList";
import Row from "../_components/projects/Row";

export default function Projects() {
    return (
        <div className="flex flex-col items-center justify-center w-full py-8 gap-4 border border-lime-400" id="projects">
            <p className="text-4xl">
                projects 
            </p>
            <p className="text-lg">
                tap on a project to learn more!
            </p>
            {data.map((row, index) => (
                <Row projects={row} key={index} />
            ))}
        </div>
    );
}