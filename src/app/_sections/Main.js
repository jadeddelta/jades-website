import { useState } from "react";
import MainContact from "../_components/main/MainContact";

export default function Main() {
    const [jobTitle, setJobTitle] = useState(0);
    const jobTitles = ["a software engineer", "a frontend developer", "an ai enthusiast", "a budding data analyst"];

    const buttonClickHandler = (e) => {
        e.preventDefault();
        setJobTitle((jobTitle + 1) % jobTitles.length);
    }

    return (
        <div className="flex flex-row items-center justify-between gap-12 px-[10%] w-full h-[90vh] grow top-0" id="main">
            <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-row">
                    <p className="text-xl">
                        hi there, i&apos;m
                    </p>
                </div>
                <p className="new text-7xl">
                    jadeddelta
                </p>
                <div className="flex flex-row grow">
                    <div className="flex-grow"/>
                    <p className="text-xl">
                        {jobTitles[jobTitle] + " "} 
                        <a href="#" onClick={buttonClickHandler}>*</a>
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                <pre>
                {
`a human centric developer 
\twith a great passion for
\t\tcreating, learning, and building`
                }
                </pre>
                <div className="flex flex-row items-center justify-evenly">
                    <MainContact 
                        image={"/icons/email.svg"} 
                        alt={"mail icon"} 
                        link={"mailto:jadeddelta@gmail.com?subject=Hello JadedDelta!"}
                    />
                    <MainContact 
                        image={"/icons/github.svg"} 
                        alt={"github icon"} 
                        link={"https://github.com/jadeddelta"} />
                    <MainContact 
                        image={"/icons/linkedin.svg"} 
                        alt={"linkedin icon"} 
                        link={"https://www.linkedin.com/in/ateabo/"} 
                        auxClass={"bg-white"}
                    />
                </div>
            </div>
        </div>
    );
}