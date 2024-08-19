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
        <div className="flex flex-col items-center justify-between w-full grow border gap-4 py-8 border-blue-500" id="about">
            <p className="text-4xl">about me</p>
            <div className="flex flex-row items-center justify-between w-full px-[20vh] py-[5vh]">
                <div className="w-[30vw]">
                    hello world! i'm a current senior at vassar college studying for a bachelor's in computer science
                    with a minor in mathematics! my interests are quite scattered around technology as a whole, as 
                    this field never ceases to amaze me. i've tried out a lot of different topics, from web 
                    development to machine learning, all the way up to rudimentary game development! 
                </div>
                <div className="w-[30vw]">
                    below, you'll find specific areas of technology that i've dabbled in, along with various projects 
                    that i've worked on. i'm always looking for new opportunities to learn and grow, so feel free to
                    reach out if you have any questions or want to chat!
                </div>
            </div>
            <p className="text-3xl">expertise</p>
            <div className="my-[10vh]" style={gridStyle}>
                {aboutList.map((item) => {
                    return (
                        <AboutCircle title={item.title} description={item.description} color={item.color} gridArea={getGridArea(item.id)} />
                    );
                })}
            </div>
        </div>
    );
}