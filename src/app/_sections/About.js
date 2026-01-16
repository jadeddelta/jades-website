import AboutCircle from "../_components/about/AboutCircle";
import { aboutList } from "../_components/about/AboutList";

export default function About() {

    const gridStyle = {
        width: "140vh",
        height: "70vh",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gridTemplateAreas: `
            "one . three ."
            ". two . four"` 
    }

    const getGridArea = (area) => {
        return {gridArea: area};
    }

    return (
        <div className="flex flex-col items-center justify-between w-full grow gap-4 py-16" id="about">
            <h2>about me</h2>
            <div className="flex flex-row items-center justify-between w-full px-[20vh] py-[5vh]">
                <div className="w-[30vw]">
                    hello world! i&apos;m a recent graduate from vassar college, with a bachelor&apos;s in computer science
                    and a math minor! i&apos;ve dabbled in plenty of diverse topics, from web dev, to machine learning, to 
                    even rudimentary game development! still so early into my career, i am passionate for learning and creating,
                    especially in my current concentration as a research software engineer, directly contributing to scientific 
                    research via making developers lives easier with better, well documented and easy to understand tools.
                </div>
                <div className="w-[30vw]">
                    below, you&apos;ll find various projects and skills that i&apos;ve developed since high school. along with 
                    that, attached is a more detailed version of my work history, projects and responsibilities that i&apos;ve taken
                    on in the past few years. i&apos;m always looking for new opportunities to learn and grow, so feel free to
                    reach out if you have any questions or want to chat/collaborate!
                </div>
            </div>
            <h3>expertise</h3>
            <div className="mt-[15vh] mb-[10vh]" style={gridStyle}>
                {aboutList.map((item, index) => {
                    return (
                        <AboutCircle title={item.title} description={item.description} color={item.color} gridArea={getGridArea(item.id)} key={index} />
                    );
                })}
            </div>
        </div>
    );
}