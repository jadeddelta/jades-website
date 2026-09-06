import type { CSSProperties } from 'react';
import type { AboutColor } from './AboutList';
import './about.css'

interface AboutCircleProps {
    title: string;
    description: string;
    color: AboutColor;
    /** positions the circle within the grid defined in About.tsx */
    gridArea: CSSProperties;
}

export default function AboutCircle(props: AboutCircleProps) {
    const contentStyle = `relative flex flex-col text-center justify-between px-10 py-12 rounded-full -m-10`;
    
    const borderStyle = `about-circle-style ` + props.color;

    return (
        <div className={contentStyle} style={props.gridArea}>
            <p className='text-cyan-200 font-semibold'>{props.title}</p>
            <p>{props.description}</p>
            <div className={borderStyle} />
        </div>
    );
}