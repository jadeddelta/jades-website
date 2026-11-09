import { projects } from "./projects";

export interface TimelineEntry {
    jobTitle: string;
    company: string;
    /** of format "month year" */
    startDate: string;
    /** of format "month year" */
    endDate: string;
    /** up to three projects worked on during this job, by name, for its stone's rhombi: left, upper right, lower right */
    projects: string[];
    description: string;
    points: TimelinePoint[];
}

export interface TimelinePoint {
    /** bullet point as html to display, rendered via dangerouslySetInnerHTML */
    html: string;
    /** project the bullet point describes, so we can color in the bullet point + highlight via cursor over job rhombus */
    project?: string;
}

const SACCADE = "saccade.js: Eyetracking for All";
const JSPSYCH = "jsPsych Development";
const DATAPIPE = "DataPipe: OAuth Integration";
const TURING = "Turing Machine Simulator";

export const timeline: TimelineEntry[] = [
    {
        jobTitle: "Research Software Engineer",
        company: "de Leeuw Lab, Vassar College",
        startDate: "july 2025",
        endDate: "september 2026",
        projects: [JSPSYCH, DATAPIPE, SACCADE],
        description: `
        Immediately after graduation, I began working full-time underneath the same POSE grant as
        a full-time Research Software Engineer, greatly expanding my responsibilities and scope of work.
        In this role, I..
    `,
        points: [
            {
                project: JSPSYCH,
                html: `continued to fulfill my role as core maintainer of <b>jsPsych</b>, by authoring and publishing packages 
        reaching 12,000+ monthly downloads, handling semantic versioning, unit tests, and CI/CD pipelines via <b>GitHub Actions</b>,
        building code that researchers around the world depend on.`,
            },
            {
                project: JSPSYCH,
                html: `oversaw 7 student developers over the course of a summer, leading them through weekly 1:1s, in depth code reviews,
        and supporting them through measures such as <b>open source software security</b>, CI/CD tools, AI harnesses for jsPsych, and ecosystem
        expansion.`,
            },
            {
                project: DATAPIPE,
                html: `built first-party authentication for DataPipe to improve interconnectivity between itself and the 
        <b>Open Science Foundation</b>, through both the front and backend of DataPipe alongside the COS's <b>Python</b>
        backend GravyValet.`,
            },
            {
                project: DATAPIPE,
                html: `architected an <b>OAuth</b> solution to allow for OSF users to log into DataPipe with their existing credentials,
        supported through the existing <b>Firebase</b> backend in a <b>REST API</b>, while simultaneously allowing for the refresh token to be used as a 
        verification for further OSF API calls, creating a true "one-click" authentication experience.`,
            },
            {
                project: JSPSYCH,
                html: `developed a <b>CLI</b> tool for parsing source HTML and JS plugin/extension/timeline files to auto-generate parameter, type, usage,
        and example documentation, to be released and a package and ran with respect to CI/CD pipelines in order to minimize contributor burden and 
        ensure organizational parity between packages across a mono-repo via templatingo.`,
            },
            {
                project: JSPSYCH,
                html: `presented posters at the conferences <b>Society for Computation in Psychology (SCiP)</b> and
        <b>US Research Software Engineer Association (US-RSE)</b>, detailing the work done on our jsPsych timeline abstraction and our
        findings for open source and open science community building.`,
            },
        ],
    },
    {
        jobTitle: "Assistant Research Software Engineer",
        company: "Vassar College",
        startDate: "september 2024",
        endDate: "may 2025",
        projects: [JSPSYCH],
        description: `
        After my work in the cognitive science department, I was selected to work under a POSE 
        (Pathways to Enable Open-Source Ecosystems) grant, where I focused my efforts primarily on 
        jsPsych. In this role, I...
    `,
        points: [
            {
                project: JSPSYCH,
                html: `maintained and developed <b>jsPsych</b> as the most recently promoted core maintainer, 
        acting as one of four with commit-and-release authority alongside having (and working through) the ability
        to engage in <b>code review</b>, merge pull requests, and triage issues.`,
            },
            {
                project: JSPSYCH,
                html: `implemented new plugins and extensions describing common experimental paradigms as found in 
        scientific literature, such as checking if a research participant is wearing headphones.`,
            },
            {
                project: JSPSYCH,
                html: `collaborated heavily with the jsPsych community, expanding community outreach and 
        engagement within the repository and on the documentation, emphasizing contributor-user experiences.`,
            },
        ],
    },
    {
        jobTitle: "Cognitive Science Programmer",
        company: "Vassar College",
        startDate: "october 2023",
        endDate: "june 2024",
        projects: [SACCADE, JSPSYCH, TURING],
        description: `
        Employed under Vassar's Cognitive Science department, I advanced forward a diverse array
        of projects, underneath the same professor that I was with during URSI. While working, I...
    `,
        points: [
            {
                project: SACCADE,
                html: `refocused efforts on eyetracking <b>machine learning</b> research, redocumented <b>data processing</b>
        pipelines and standardized processing of 5000+ video clips using <b>OpenCV</b> and <b>MediaPipe</b>.`,
            },
            {
                project: SACCADE,
                html: `explored new research literature, implementing novel solutions in <b>computer vision</b> such as 
        <b>visual transformers</b> and novel loss functions in <b>Tensorflow</b> and <b>Keras</b>.`,
            },
            {
                project: JSPSYCH,
                html: `began working on <b>jsPsych</b>, writing <b>TypeScript</b> production code, implementing features for
        plugins with corresponding <b>unit testing</b>, based on GitHub issues and discussions.`,
            },
            {
                project: JSPSYCH,
                html: `spearheaded a full documentation overhaul to enable better <b>npmjs</b> package visibility, alongside 
        a vocabulary reform and standardization across all packages to better improve readability and correctness.`,
            },
            {
                project: TURING,
                html: `began work on a modernization of Vassar College's turing machine simulator, updating a 7-year-old
        website to <b>Next.js</b> with modern <b>React</b> and <b>Redux</b> practices.`,
            },
        ],
    },
    {
        jobTitle: "Machine Learning Research Assistant",
        company: "Vassar College",
        startDate: "may 2023",
        endDate: "august 2023",
        projects: [SACCADE],
        description: `
        For this summer, I was able to continue my work from the previous summer's URSI,
        working on the exact same project but on a different team of 2 other students. This time,
        I...
    `,
        points: [
            {
                project: SACCADE,
                html: `expanded on <b>computer vision</b> machine learning research conducted last summer, implementing 
        various models such as <b>Siamese Networks</b> and <b>Attention Mechanisms</b>.`,
            },
            {
                project: SACCADE,
                html: `fabricated <b>ETL</b> pipelines to process 1000+ participants' data in a <b>Python</b>
        package, allowing for modular and scalable data processing of various facial landmark points.`,
            },
            {
                project: SACCADE,
                html: `utilized services such as <b>Weights & Biases</b> for <b>hyperparameter tuning</b>, finalizing a <b>Siamese 
        CNN embedding model</b> with <b>attention</b> and a custom <b>triplet loss function</b>.`,
            },
            {
                project: SACCADE,
                html: `similarly to last year, presented our final model with a poster to the URSI symposium,
        with a final model that reported a normalized euclidean distance error of <b>7.18%</b>.`,
            },
        ],
    },
    {
        jobTitle: "Machine Learning Research Assistant",
        company: "Vassar College",
        startDate: "may 2022",
        endDate: "july 2022",
        projects: [SACCADE],
        description: `
        I participated in Vassar College's URSI (Undergraduate Research Summer Institute)
        where I worked on a project to use Machine Learning to predict the outcome of where a user 
        is looking on a screen given webcam data. In this project, I...
    `,
        points: [
            {
                project: SACCADE,
                html: `devised a research and development plan with my team, which brought forward my first experiences with
        collaborative programming, <b>Git</b> version control, and <b>GitHub's</b> hosting platform.`,
            },
            {
                project: SACCADE,
                html: `developed in <b>Python</b>, using packages such as <b>TensorFlow</b> for the ML model,
        and <b>OpenCV</b> for webcam data; along with using <b>JavaScript</b> with JsPsych for 
        desgining the experiments that would be disseminated over <b>Prolific</b>.`,
            },
            {
                project: SACCADE,
                html: `architected a <b>CNN embedding</b> network with <b>LSTM</b> processing, along with our own custom
        <b>ETL</b> pipelines for processing data with google's <b>MediaPipe</b> for facial landmark demarkation.`,
            },
            {
                project: SACCADE,
                html: `presented our final model to the URSI symposium with a poster detailing our research and findings
        creating a model with a mean distance error of <b>18%</b>.`,
            },
        ],
    },
];

// quick check I added cause i know i'll be mispelling stuff for fun
if (process.env.NODE_ENV !== "production") {
    const names = new Set(projects.map((project) => project.name));
    for (const job of timeline) {
        for (const name of [...job.projects, ...job.points.map((point) => point.project)]) {
            if (name && !names.has(name)) throw new Error(`work.ts: ${job.jobTitle} names no project "${name}"`);
        }
    }
}
