import { useState } from "react";
import MainContact from "../_components/main/MainContact";
import '../_components/main/main.css'

export default function Main() {
    const [jobTitle, setJobTitle] = useState(0);
    const jobTitles = ["a software engineer", "a frontend developer", "an ai enthusiast", "a budding data analyst"];

    const buttonClickHandler = (e) => {
        e.preventDefault();
        setJobTitle((jobTitle + 1) % jobTitles.length);
    }

    return (
        <div className="flex flex-row items-center justify-between px-[10%] w-full h-[90vh] main-container" id="main">
            <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-row">
                    <p className="text-xl">
                        hi there! i&apos;m
                    </p>
                </div>
                <h1 className="new">
                    jadeddelta
                </h1>
                <div className="flex flex-row grow">
                    <div className="flex-grow"/>
                    <p className="text-xl">
                        {jobTitles[jobTitle] + " "} 
                        <a className="text-2xl font-bold" href="#" onClick={buttonClickHandler}>*</a>
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                <pre>
                {
`a human centric developer 
\twith a great passion for
\t\tlearning, creating, and upgrading`
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