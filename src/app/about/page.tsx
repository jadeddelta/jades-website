import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../_components/layout/SectionHeader";

export const metadata: Metadata = {
    title: "about",
    description: "about jadeddelta, a research software engineer",
};

const BODY = "flex flex-col gap-6 text-[clamp(18px,1.4vw,20px)] leading-[1.75] text-body";

const LINK =
    "text-jade underline decoration-jade/50 underline-offset-4 transition-colors hover:text-jade-bright hover:decoration-jade-bright";

export default function About() {
    return (
        <section id="top" className="flex w-full flex-col gap-10 px-[clamp(20px,5vw,48px)] py-16 sm:w-[70%] sm:px-0">
            <SectionHeader as="h1" title="about me" />
            <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
                <div className={BODY}>
                    <p>hi there, i'm jade! thanks for taking a peek.</p>
                    <p>
                        i'm currently a core maintainer of{" "}
                        <Link href={"https://www.jspsych.org/latest/"} className={LINK}>
                            jsPsych
                        </Link>
                        , and most of my work surrounds the intersection between online research and software
                        development.
                    </p>
                </div>
                {/* capped so it doesn't swamp the text; on wider screens it sits at the content's right edge */}
                <figure className="flex max-w-60 flex-col gap-3 sm:max-w-72 sm:justify-self-end">
                    <Image
                        src="/internal-images/github-avatar.png"
                        alt="jade's github avatar: a pink pixel-art bunny face"
                        width={420}
                        height={420}
                        className="h-auto w-full border border-jade/40 [image-rendering:pixelated]"
                    />
                    <figcaption className="font-mono text-[12px] leading-[1.7] text-mono-dim">
                        got this auto-assigned to me on github, don't think I want anything else{" "}
                        <span className="whitespace-nowrap">𑣲₍ ᐢ. .ᐢ₎</span>
                    </figcaption>
                </figure>
            </div>
            <SectionHeader as="h3" title="background" />
            <div className={BODY}>
                <p>
                    i'm just a newbie in the tech industry, but undoubtedly passionate on all matters development, both
                    for the self and within the terminal. always looking for a chance to grow, to learn something new,
                    to tinker with novel solutions, and just solve problems that'll make people's lives more
                    straightforward and stress-free.
                </p>
                <p>
                    my professional work is centered around being a research software engineer, creating and adding to
                    software that helps researchers do their job without worrying about the tech underneath, by writing
                    intuitive APIs, systems, and documentation for non-technical and technical users alike.
                </p>
            </div>
        </section>
    );
}
