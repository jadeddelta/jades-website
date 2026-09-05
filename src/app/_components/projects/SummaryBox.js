import { getProjectClass } from './ProjectList';
import './projects.css'

export default function SummaryBox({ project, expand }) {

    const sizeClass = project.major ? " w-[67%] " : " w-[33%] ";
    
    const projectClass = getProjectClass(project.category[0]) + "-project project-container";

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
                {project.category.join(" ✧ ").toLowerCase()}
            </p>
        </button>
    );
}