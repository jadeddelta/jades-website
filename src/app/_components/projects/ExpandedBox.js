import Image from 'next/image';
import { getProjectClass } from './ProjectList';

export default function ExpandedBox({ project, compress }) {

    const projectString = project.skills.slice(0, -1).join(" ✧ ");

    const projectType = project.skills[project.skills.length - 1];
    const projectBorderClass = getProjectClass(projectType) + "-expanded expanded-container project-container";
    const projectButtonClass = getProjectClass(projectType) + "-expanded expanded-button";

    return (
        <div className={"flex flex-col items-center justify-between w-full h-[66vh] p-4 m-2 " + projectBorderClass}>
            <div className="flex flex-row items-center justify-between w-full">
                <p className="text-3xl font-bold">
                    {project.name}
                </p>
                <button
                    className={"text-lg text-black " + projectButtonClass} 
                    onClick={compress}
                >
                    go back
                </button>
            </div>
            <div className="flex flex-row items-center">
                <div className="columns-2 gap-4 grow text-base w-2/3">
                    {project.complexDescription.join(' ')}
                </div>
                <div className="flex flex-col items-center text-center justify-between w-1/3 pl-4 py-2 gap-1">
                    <Image 
                        src={project.internalImage} 
                        alt={project.internalAlt} 
                        width={300}
                        height={200}
                    />
                    <p className="text-sm project-shadow">{project.internalCaption}</p>
                </div>
            </div>
            <div className="flex flex-row justify-between items-center w-full h-[10%]">
                <div className="flex flex-row">
                    {projectString}
                </div>
            </div>
        </div>
    );
}