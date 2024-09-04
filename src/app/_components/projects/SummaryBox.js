import { getProjectClass } from './ProjectList';
import './projects.css'

export default function SummaryBox({ project, expand }) {

    const sizeClass = project.major ? " w-[67%] " : " w-[33%] ";
    
    const projectType = project.skills[project.skills.length - 1];
    const projectClass = getProjectClass(projectType) + "-project project-container";

    return (
        <button 
            className={"flex flex-col items-center justify-between text-center h-[66vh] p-4 m-2 border-2 border-slate-400 rounded-lg" + sizeClass + projectClass}
            onClick={expand}
        >
            <p className="text-3xl font-bold">
                {project.name}
            </p>
            <p className="text-xl project-shadow">
                {project.simpleDescription}
            </p>
            <p className="project-shadow">
                {projectType.toLowerCase()}
            </p>
        </button>
    );
}