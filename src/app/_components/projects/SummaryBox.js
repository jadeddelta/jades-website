
export default function SummaryBox({ project, expand }) {

    const sizeClass = project.major ? " w-[67%]" : " w-[33%]";

    return (
        <button 
            className={"flex flex-col items-center justify-between text-center h-[66vh] p-4 m-2 border-2 border-slate-400 rounded-lg" + sizeClass}
            onClick={expand}
        >
            <p className="text-3xl">
                {project.name}
            </p>
            <p className="text-xl">
                {project.simpleDescription}
            </p>
            <p>
                {project.skills[project.skills.length - 1].toLowerCase()}
            </p>
        </button>
    );
}