import type { Metadata } from "next";
import WorkTimeline from "../_components/work/WorkTimeline";
import { loadIcon } from "../_content/icons";
import { projects } from "../_content/projects";
import { timeline } from "../_content/work";

export const metadata: Metadata = {
    title: "work",
    description: "professional experience of jadeddelta, a research software engineer",
};

export default function WorkPage() {
    // the stones show each project's own mark, and its display shows its language's icon
    const used = projects.filter((project) => timeline.some((job) => job.projects.includes(project.name)));
    const names = new Set(used.flatMap((project) => [project.projectSvg, project.language]));
    const icons = Object.fromEntries([...names].map((name) => [name, loadIcon(name)]));

    return <WorkTimeline icons={icons} />;
}
