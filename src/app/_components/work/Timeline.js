import TimelineButton from "./TimelineButton";
import TimelineDescription from "./TimelineDescription";
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
            <div className="flex w-[90vw] items-start flex-col">
                {workInfo.map((work, index) => {
                    // TODO: do something fun with the active
                    return (
                        <div key={index} className="flex pb-8 gap-4">
                            <TimelineButton job={work} active={active === index} handleClick={() => getHandler(index)}/>
                            <TimelineDescription job={work} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}