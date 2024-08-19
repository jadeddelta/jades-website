import Timeline from "../_components/work/Timeline";

export default function Work() {
    return (
        <div className="flex flex-col items-center justify-evenly w-full py-8 gap-16 border border-emerald-300" id="work">
            <p className="text-4xl">
                professional experience
            </p>
            <Timeline />
        </div>
    );
}