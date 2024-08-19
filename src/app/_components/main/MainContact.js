import Image from "next/image";

export default function MainContact(props) {

    const handleClick = (e) => {
        e.preventDefault();
        window.location.href = props.link;
    };

    return (
        <div className={"flex flex-col items-center justify-center " + props.auxClass}>
            <button onClick={handleClick}>
                <Image src={props.image} alt={props.alt} width="64" height="64" />
            </button>
        </div>
    );
}