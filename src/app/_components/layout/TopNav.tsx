"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** every page on the site */
const LINKS = [
    { href: "/", label: "home" },
    { href: "/projects", label: "projects" },
    { href: "/work", label: "work" },
    { href: "/notes", label: "notes" },
    { href: "/about", label: "about" },
] as const;

interface TopNavProps {
    /** false hides the notes link; layout.tsx sets it while there are no notes */
    showNotes: boolean;
}

export default function TopNav({ showNotes }: TopNavProps) {
    const pathname = usePathname();
    const links = showNotes ? LINKS : LINKS.filter((link) => link.href !== "/notes");

    const isCurrent = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="sticky top-[6px] z-50 flex h-[7.5vh] w-full items-center justify-center">
            {/* 11px on phones, so all five links fit on one line at 375px */}
            <nav
                aria-label="site"
                className="notch-pill border border-jade/40 bg-panel px-5 py-2 font-mono text-[11px] tracking-[0.1em] sm:text-[12px] backdrop-blur-md"
            >
                {links.map((link, index) => (
                    <Fragment key={link.href}>
                        {index > 0 && <span className="text-mono-dim">{" // "}</span>}
                        <Link
                            href={link.href}
                            aria-current={isCurrent(link.href) ? "page" : undefined}
                            className={
                                "transition-colors hover:text-jade-bright " +
                                (isCurrent(link.href) ? "text-jade" : "text-dim")
                            }
                        >
                            {link.label}
                        </Link>
                    </Fragment>
                ))}
            </nav>
        </header>
    );
}
