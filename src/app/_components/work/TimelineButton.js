import { useState } from "react";
import './work.css'

export default function TimelineButton({ job, active, handleClick }) {

    return (
        // todo: take job date and name out of this class
        <button className={"timeline-button-style"} onClick={handleClick}>
            <div className="-top-[7.5vh] -left-[7.5vw] relative w-[20vw] text-gray-300">
                <p>{job.date}</p>
            </div>
            <div className="-bottom-[7.5vh] -left-[7.5vw] relative w-[20vw] text-gray-300">
                <p>{job.name}</p>
            </div>
        </button>
    );
}