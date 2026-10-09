import type { Metadata } from "next";
import SectionHeader from "../_components/layout/SectionHeader";
import Link from "next/link";

export const metadata: Metadata = {
    title: "about",
    description: "about jadeddelta, a research software engineer",
};

export default function About() {
    // the trail finds this section by its id, listed in _pages/about.ts
    return (
        <section id="top" className="prose-column flex flex-col gap-10">
            <SectionHeader as="h1" title="about me" />
            <div className="prose-text flex flex-col gap-6">
                <p>
                    hello world! i&apos;m jade. i&apos;m a core maintainer of{" "}
                    <Link href={"https://www.jspsych.org/latest/"}>jsPsych</Link>, and I graduated with a
                    bachelor&apos;s, majoring in computer science with a math minor. i&apos;ve dabbled in a diverse
                    array of topics, from web development with respect to doing research online, to machine learning to
                    predict gaze with a web cam, to even rudimentary game development! still so early into my career, i
                    am passionate for learning and creating, especially in my current concentration as a research
                    software engineer, directly contributing to scientific research via making developers lives easier
                    with better, well documented and easy to understand tools.
                </p>
            </div>
        </section>
    );
}
