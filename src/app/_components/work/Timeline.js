import TimelineButton from "./TimelineButton";
import TimelineDash from "./TimelineDash";
import { TimelineList as workInfo } from "./TimelineList";
import { useState } from "react";

export default function Timeline() {

    const [active, setActive] = useState(-1);

    const getHandler = (index) => {
        if (active === index) {
            setActive(-1);
        } else {
            setActive(index);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center">
                <TimelineDash />
                {workInfo.map((work, index) => {
                    return (
                        <>
                            <TimelineButton job={work} active={active === index} handleClick={() => getHandler(index)}/>
                            <TimelineDash />
                        </>
                    );
                })}
            </div>
            <div className="flex flex-col justify-center items-center p-12 w-[80vw] h-[60vh] border-2 border-dashed rounded-lg border-gray-500 m-auto gap-4">
                {active === -1 ? (
                    <div className="">
                        <pre className="text-gray-500">tap a circle for more information !</pre>
                    </div>
                ) : (
                    <>
                        <p>
                            {workInfo[active].description}
                        </p>
                        <ul className="list-disc w-full px-8">
                            {workInfo[active].points.map((point, index) => {
                                return (
                                    // point is a hardcoded string, so XSS is not a concern
                                    <li key={index} dangerouslySetInnerHTML={{ __html: point }}/>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}