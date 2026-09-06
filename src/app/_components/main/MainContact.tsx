import Image from "next/image";
import type { MouseEvent } from "react";

interface MainContactProps {
    image: string;
    alt: string;
    link: string;
    auxClass?: string;
}

export default function MainContact(props: MainContactProps) {

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.location.href = props.link;
    };

    return (
        <div className={"flex flex-col items-center justify-center " + (props.auxClass ?? "")}>
            <button onClick={handleClick}>
                <Image src={props.image} alt={props.alt} width="64" height="64" />
            </button>
        </div>
    );
}