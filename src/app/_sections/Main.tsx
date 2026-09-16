import IconLink from "../_components/main/IconLink";
import TitleCycler from "../_components/main/TitleCycler";

const TITLES = [
    "a software engineer",
    "a frontend developer",
    "an ai enthusiast",
    "a budding data analyst",
] as const;

const MAILTO = "mailto:jadeddelta@gmail.com?subject=hello jade!";

export default function Main() {
    return (
        <section id="main" className="flex min-h-[90vh] w-full items-center px-[clamp(20px,3vw,48px)] min-[1400px]:px-[10%] py-16">
            <div className="flex w-full flex-wrap items-center gap-x-[clamp(32px,5vw,96px)] gap-y-14">
                <div className="mr-auto flex flex-col gap-3">
                    <p className="font-mono text-[16px] tracking-[0.04em] text-mono-dim hero-shade">
                        hi there! i&apos;m
                    </p>
                    <h1 className="hero-glow text-white">jadeddelta</h1>
                    <TitleCycler titles={TITLES} />
                </div>

                <div className="ml-auto flex flex-col items-end gap-8">
                    {/* type and indents step down on narrower screens so the row holds at ~900px and the last line fits at ~420px */}
                    <p className="border-l border-jade/35 bg-[rgba(9,20,16,0.73)] py-5 pr-5 pl-5 font-mono text-[13px] leading-[1.85] text-body sm:text-[14px] lg:text-[15px]">
                        <span className="block">a human centric developer</span>
                        <span className="block pl-[2ch] sm:pl-[4ch]">with a great passion for</span>
                        <span className="block pl-[4ch] sm:pl-[8ch]">learning, creating, and upgrading</span>
                    </p>
                    <div className="flex gap-3">
                        <IconLink href={MAILTO} icon="/icons/email.svg" label="email jade" />
                        <IconLink href="https://github.com/jadeddelta" icon="/icons/github.svg" label="jade on github" />
                    </div>
                </div>
            </div>
        </section>
    );
}
