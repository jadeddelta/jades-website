import Timeline from "../_components/work/Timeline";

export default function Work() {
    return (
        <div className="flex flex-col items-center justify-evenly w-full pt-16 pb-8 gap-16" id="work">
            <p className="text-4xl">
                professional experience
            </p>
            <Timeline />
        </div>
    );
}