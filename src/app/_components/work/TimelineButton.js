import './work.css'
import TimelineDash from "./TimelineDash";

export default function TimelineButton({ job, active, handleClick }) {

    return (
        // todo: take job date and name out of this class
        <div className={"flex flex-col items-center"}>
            <div>
                <button className={"timeline-button-style " + (active ? "bg-white" : "")} onClick={handleClick}>
                </button>
            </div>
            <TimelineDash />
        </div>
    );
}