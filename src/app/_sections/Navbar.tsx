import { Fragment } from "react";
import Link from "next/link";
import { SECTION_IDS, SECTION_LABEL } from "./sections";

export default function Navbar() {
    return (
        <header className="sticky top-[6px] z-50 flex h-[7.5vh] w-full items-center justify-center">
            <nav className="notch-pill border border-jade/40 bg-panel px-5 py-2 font-mono text-[12px] tracking-[0.1em] backdrop-blur-md">
                {SECTION_IDS.map((id, index) => (
                    <Fragment key={id}>
                        {index > 0 && <span className="text-mono-dim">{` // `}</span>}
                        <Link className="text-dim transition-colors hover:text-jade-bright" href={`#${id}`}>
                            {SECTION_LABEL[id]}
                        </Link>
                    </Fragment>
                ))}
            </nav>
        </header>
    );
}
