import type { Metadata } from "next";
import Ocean from "../_components/projects/Ocean";
import { loadIcon, stoneIcons } from "../_content/icons";
import { LANGUAGES, projects } from "../_content/projects";
import type { Language } from "../_content/projects";

export const metadata: Metadata = {
    title: "projects",
    description: "projects by jadeddelta, from research tooling to games",
};

export default function ProjectsPage() {
    const stones = projects.map((project) => ({ project, icons: stoneIcons(project) }));
    const languageIcons = Object.fromEntries(LANGUAGES.map((language) => [language, loadIcon(language)])) as Record<
        Language,
        string
    >;

    return <Ocean stones={stones} languageIcons={languageIcons} />;
}
