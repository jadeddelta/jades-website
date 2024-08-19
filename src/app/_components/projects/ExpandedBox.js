import Image from 'next/image';

export default function ExpandedBox({ project, compress }) {

    const projectString = project.skills.slice(0, -1).join(" ✧ ");

    return (
        <div className="flex flex-col items-center justify-between w-full h-[66vh] border-2 p-4 m-2 border-lime-400 rounded-lg">
            <div className="flex flex-row items-center justify-between w-full">
                <p className="text-3xl">
                    {project.name}
                </p>
                <button
                    className="text-lg border-2 border-lime-600 bg-lime-400 text-black px-2 py-1 rounded-lg hover:bg-lime-500 transition duration-300 ease-in-out" 
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
                    <p className='text-sm'>{project.internalCaption}</p>
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