import './work.css'
import TimelineDash from "./TimelineDash";

interface TimelineButtonProps {
    active: boolean;
    handleClick: () => void;
}

export default function TimelineButton({ active, handleClick }: TimelineButtonProps) {

    return (
        <div className={"flex flex-col items-center"}>
            <div>
                <button className={"timeline-button-style " + (active ? "bg-white" : "")} onClick={handleClick}>
                </button>
            </div>
            <TimelineDash />
        </div>
    );
}