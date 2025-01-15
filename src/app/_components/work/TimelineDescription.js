export default function TimelineDescription({ job }) {
    return (
        <div className={"text-gray-300 mr-8"}>
                <p className="text-[#7ca183]">{job.startDate + " to " + job.endDate}</p>
                <p className="font-bold text-lg">{job.name}</p>
                <p>{job.description}</p>
                <ul className="list-disc ml-8">
                    {job.points.map((point, index) => {
                        return (
                            // point is a hardcoded string, so XSS is not a concern
                            <li key={index} dangerouslySetInnerHTML={{ __html: point }}/>
                        );
                    })}
                </ul>
        </div>
    );
}