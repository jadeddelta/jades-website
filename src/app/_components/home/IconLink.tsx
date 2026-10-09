import Image from "next/image";

interface IconLinkProps {
    href: string;
    icon: string;
    /** read by screen readers in place of the icon */
    label: string;
}

export default function IconLink({ href, icon, label }: IconLinkProps) {
    return (
        <a
            href={href}
            aria-label={label}
            className="group block transition-[filter] hover:drop-shadow-[0_0_14px_rgba(53,230,164,0.35)] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-jade"
        >
            <span className="notch-pill flex h-[52px] w-[52px] items-center justify-center border border-jade/45 bg-panel transition-colors group-hover:border-jade">
                <Image src={icon} alt="" width={24} height={24} />
            </span>
        </a>
    );
}
