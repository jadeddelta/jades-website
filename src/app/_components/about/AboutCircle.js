import './about.css'

export default function AboutCircle(props) {
    const contentStyle = `relative flex flex-col text-center justify-between px-10 py-12 rounded-full -m-10`;
    
    const borderStyle = `about-circle-style ` + props.color;

    return (
        <div className={contentStyle} style={props.gridArea}>
            <p className=' text-cyan-100'>{props.title}</p>
            <p>{props.description}</p>
            <div className={borderStyle} />
        </div>
    );
}