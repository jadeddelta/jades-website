import type { Metadata } from "next";
import Timeline from "../_components/work/Timeline";

export const metadata: Metadata = {
    title: "work",
    description: "professional experience of jadeddelta, a research software engineer",
};

export default function WorkPage() {
    // the trail finds this section by its id, listed in _pages/work.ts
    return (
        <div className="page-inset flex flex-col items-center w-full gap-8 py-16" id="work">
            <h1>professional experience</h1>
            <Timeline />
        </div>
    );
}
