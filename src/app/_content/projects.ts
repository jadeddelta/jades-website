/** what kind of project it is, determines the stone's outline and icon colors */
export type Category = "web" | "game" | "sw" | "ui" | "ml" | "data";

/** each category's name and color (r, g, b), in the order the type filter lists them */
export const CATEGORIES: Record<Category, { name: string; rgb: string }> = {
    web: { name: "web development", rgb: "96,228,96" },
    game: { name: "game / app", rgb: "228,228,96" },
    sw: { name: "software", rgb: "140,140,255" },
    ui: { name: "ui / ux design", rgb: "228,96,228" },
    ml: { name: "machine learning", rgb: "228,96,96" },
    data: { name: "data analysis", rgb: "96,228,228" },
};

/** a project's one and only language, name shared by the icon name */
export type Language = "python" | "javascript" | "typescript" | "java" | "csharp";

/** every language, in the order the language filter lists them */
export const LANGUAGES: Language[] = ["python", "typescript", "javascript", "java", "csharp"];

export interface Project {
    name: string;
    /** points, one paragraph each, each stepped in a little further than the last */
    description: string[];
    category: Category;
    language: Language;
    /** icon for the stone's top-right rhombus: a framework or tool the project used */
    wildcardSvg: string;
    /** icon for the stone's bottom rhombus: the project's own mark */
    projectSvg: string;
    /** shown along the bottom of the display; the language isn't repeated here */
    skills: string[];
    /** file name in public/internal-images/, e.g. "chess-cli.png" */
    image: string;
    imageAlt: string;
    caption: string;
    /** the link in the display's top-right tab, e.g. "see our poster!" */
    linkText?: string;
    projectLink?: string;

    /* planned, not shown on the page yet */

    /** link to a note or blog post about the project */
    insight?: string;
}

export const projects: Project[] = [
    {
        name: "saccade.js: Eyetracking for All",
        description: [
            "Spanning two internships, a work-study job, and a full-time job, we've created an ML model " +
                "that can accurately predict the gaze of a user given webcam feed, allowing researchers to conduct eyetracking via laptop cameras.",
            "The first summer, I was in charge of write experiments in jsPsych to gather the data, and also developed a CNN-LSTM model " +
                "that had a distance error of 18%. The next summer, I wrote modular ETL pipelines to process thousands of participants' eye data, parameterized by " +
                "facial landmarks. We wrote custom model architectures, ending with an error of 7.18%.",
            "Afterwards, work was done on exploring how we could improve the model. We expanded upon " +
                "hyperparameter tuning via Weights & Biases, augmented the dataset, and began to write a paper, which " +
                "will be published soon.",
        ],
        category: "ml",
        language: "python",
        wildcardSvg: "tensorflow",
        projectSvg: "eye",
        skills: ["TensorFlow", "Keras", "OpenCV", "SLURM", "Experimental Design", "Prolific"],
        image: "eyetracking-triplet-loss.PNG",
        imageAlt: "eyetracking triplet loss visualization",
        caption:
            "Depiction of our triplet loss function, presented to a symposium after our second summer. Loss is minimized when " +
            "the blue anchor point is closer to the green positive point than the red negative point.",
        linkText: "see docs and a live demo!",
        projectLink: "https://saccade.jspsych.org/",
    },
    {
        name: "ASA Datafest 2024",
        description: [
            "Over a weekend hackathon, on a team of 5 students, I conducted data analysis on a dataset provided by CourseKata, a web-based statistics course. " +
                "The dataset consisted of student web traffic data, survey, and performance data.",
            "In Jupyter Notebook, I used pandas to clean up and organize the data into individual student clickstreams to understand in what order students " +
                "were accessing pages when working on certain chapters. With this, I aggregated the data to create multiple weighted graphs using matplotlib and NetworkX.",
            "This information can be used by CourseKata to optimize their lessons, providing hints or recall questions to reduce friction, so students don't have to move " +
                "from page to page. After presenting these points to the panel with corresponding graphs on specific chapters, we won the award for Best Analysis!",
        ],
        category: "data",
        language: "python",
        wildcardSvg: "pandas",
        projectSvg: "network",
        skills: ["Jupyter Notebook", "pandas", "NetworkX", "matplotlib"],
        image: "asa-chapter5-graph.png",
        imageAlt: "data visualization network graph",
        caption:
            "Weighted graph of which sections students would return to while on Chapter 5, which is on models. " +
            "The thicker the line, the more students went back, indicating concepts that should be revisited in hints.",
    },
    {
        name: "Turing Machine Simulator",
        description: [
            "During my work underneath my college's Cognitive Science Department, I was tasked with updating a 7 year old website to use modern technologies across many " +
                "major versions, from React v14 to v18, and Redux v3 to v4. While preserving the functionality, I was also directed to modernize the interface and improve user experience.",
            "This includes aspects such as clear and intuitive test creation, feedback, and parallelization, alongside consistent themeing and a more maintainable codebase.",
            "While de-prioritized for the time being, the codebase is planned to be taken over and completed by a future student worker.",
        ],
        category: "web",
        language: "javascript",
        wildcardSvg: "react",
        projectSvg: "turing-machine",
        skills: ["React", "Redux", "Next.js", "MaterialUI"],
        image: "turing-machine-tests.png",
        imageAlt: "updated testing display of the Turing Machine Simulator",
        caption:
            "An indev version of the new testing suite, with intuitive test status icons and a specific field for error codes. " +
            "Before, tests did not give immediate feedback and could not render statuses in parallel.",
        linkText: "indev",
    },
    {
        name: "jsPsych Development",
        description: [
            "My growth as a software developer can be viewed through my work on jsPsych, my first work on an open-source project. " +
                "With contributions on documentation and npm visibility to learn Git workflow, and after much assistance and exploration, " +
                "I made PRs targeting features and fixes requested by other researchers.",
            "Soon, this would blossom into creating my own plugins, timelines, and owning parts of the core codebase for major improvements to developer usability. " +
                "I became proficient enough to go on trial reviewing others' PRs, and became one of the 4 core maintainers of the project.",
            "My work went on, engaging in issue triages, implementing experimental paradigms into jsPsych packages, and mentoring student workers " +
                "on the project to bolster CI/CD workflows and open source security practices.",
        ],
        category: "web",
        language: "typescript",
        wildcardSvg: "githubactions",
        projectSvg: "jspsych",
        skills: ["Git", "npm", "Open Source Development", "Jest", "JavaScript Tooling", "CI/CD via Github Actions"],
        image: "jspsych-cloze-test.png",
        imageAlt: "a cloze test in jsPsych, showing a passage with boxes for missing words to fill in.",
        caption:
            "An example of plugin-cloze, where users fill in blanks of a passage. I made contributions to this plugin as one of my first pull requests, " +
            "parameterizing case sensitivity and enabling multiple correct answers per blank.",
        linkText: "see our docs website!",
        projectLink: "https://www.jspsych.org/latest/",
    },
    {
        name: "Amethyst, A Focus Timer",
        description: [
            "For my Software Design and Implementation class, I was paired up with a friend to create an app in Android Studio, written in Java for the purposes " +
                "of teaching us iterative development, Agile workflows, and UML diagrams. We decided to make a pomodoro app with a gamified twist: a Match-3 break " +
                "period with persistent state between periods and sessions.",
            "I personally handled the Match-3 game and design, implementing a Bejeweled-like system with combos and correct move generation. Through this project, " +
                "we learned much about collaborative app development, such as Extreme Programming, Model-View-Controller and the Android file system.",
            "We presented the app at the end of the semester, to glowing class reviews and an amazing final score with feedback from the professor.",
        ],
        category: "game",
        language: "java",
        wildcardSvg: "android",
        projectSvg: "amethyst",
        skills: [
            "Android Studio",
            "Software Development Cycle",
            "Pair Programming",
            "Iterative Development",
            "PlantUML",
        ],
        image: "amethyst-title-screen.png",
        imageAlt: "homepage of the time management app, showing a purple gem and the title Amethyst.",
        caption:
            "A clean homepage I created for the app. Took the first time to flex the design muscles for this app... but all in paint.net.",
        linkText: "prof's eyes only!",
    },
    {
        name: "Talkative in MLH Hackathon",
        description: [
            "I participated in my first hackaton, MLH Hack with a Crew, in 2022 with 2 friends. With the theme of community, and our previous experiences with " +
                "tones in communication, we decided to create a chatbot that assists users in speaking more clearly and confidently, by " +
                "giving feedback to the user based on sentiment analysis conducted by Cohere's Natural Language Processing.",
            "I was in charge of the UI/UX, using Figma for the first time and an implementing in Bootstrap to develop my skill on designing and building interfaces. " +
                "Even though this work wasn't used in the end project, due to technical limitations raised by the other team members, I still consider this valuable in " +
                "the path of developing clean and intuitive user interfaces for others.",
            "Plus, after our project presentation, we ended up winning 'Best Use of Natural Langauge Processing'.",
        ],
        category: "ui",
        language: "javascript",
        wildcardSvg: "figma",
        projectSvg: "talkative",
        skills: ["Figma", "Bootstrap", "Natural Language Processing", "Cohere API"],
        image: "talkative-login-screen.png",
        imageAlt: "talkative login screen, showing simple login fields",
        caption:
            "A simple login page that I designed for the app, completely within Figma, and implemented by myself in Bootstrap.",
        linkText: "privated",
    },
    {
        name: "YAPPER Chess Program",
        description: [
            "My first advanced CS elective was on Intelligent Game AI, where our goal was to create a chess engine with a group over the course of the semester. " +
                "The class was very research-oriented, focusing on different representations of chess in memory, alongside the algorithms used to conduct board scoring.",
            "At the mid point, my group had not written a single line of code (that I am still salty about), but I was allowed to take the project into my own hands. " +
                "I wrote a general framework using OOP principles to compare between multiple representations of the board and algorithms to parse scoring and best moves. " +
                "I used this in a comparative analysis, seeing how modern CPUs and bytecode generation could be leveraged to make boards more efficient, leading to deeper " +
                "searches.",
            "In the end, I presented to the class with great marks for a one person project.",
        ],
        category: "sw",
        language: "java",
        wildcardSvg: "gradle",
        projectSvg: "queen",
        skills: ["Gradle", "Search Algorithms", "JVM Bytecode", "IntelliJ IDEA"],
        image: "chess-cli.png",
        imageAlt: "command line interface of the YAPPER chess program",
        caption:
            "YAPPER's (Yet Another Paradigm Procuring chEss Representations) CLI interface, in 'Game' Mode, allowing the user to play against a selection of bots.",
        linkText: "privated",
    },
    {
        name: "Deep Sea Defense",
        description: [
            "I participated in my first game jam: Shell We Jam 2023, with a group of 4. The theme was Deep Sea, and I brought up the idea of a " +
                "variation on my favorite childhood genre of Tower Defense games. The idea was to play around with vision, and cover the whole " +
                "map in darkness.",
            "Instead, the player would use their cursor as a flash light, clicking to send a light pulse that would linger for a moment, allowing " +
                "towers to see and fire upon enemies. Important management of one's vision is paramount to success, alongside the tower placement and economy management.",
            "While most of the game design was architected by myself and iterated upon with discussions involving my group, and a little bit of " +
                "work done in Unity, due to an emerging medical condition, I had to drop out. The game was received well by the panelists.",
        ],
        category: "game",
        language: "csharp",
        wildcardSvg: "unity",
        projectSvg: "squid",
        skills: ["Unity", "Game Design"],
        image: "deep-sea-defense-gameplay.png",
        imageAlt:
            "gameplay of the game Deep Sea Defense, with a mother squid, a track leading to her, and a pocket of vision created by the player.",
        caption:
            "The enemies attempt to wake up the mother squid, and disturb her slumber. A player can click to light up the area, so our loyal jellyfish " +
            "can help us. Protect the mother squid!~",
        linkText: "try it on the web!",
        projectLink: "https://julwang.itch.io/deep-sea-defense",
    },
    {
        name: "DataPipe: OAuth Integration",
        description: [
            "In collaboration with the Center of Open Science, I worked on a first-party OAuth system between DataPipe and the Open Science Foundation. " +
                "This was my first major project at my first full-time job, and it was exciting learning the technology and architecting the solution from " +
                "the ground up, learning proper protocols for authentication on the web while designing all the components and giving the site a makeover.",
            "This was primarily implemented in TypeScript via Firebase, creating a REST API for both authentication, and using the auth service to also " +
                "validate requests to the OSF via a constantly refreshing token, further reducing friction as before you'd need to make a Personal Access Token.",
            "While the OSF being used as a repository is being sunsetted, this work was foundational in further adding Google Drive, Dataverse, and Zenodo as storage providers.",
        ],
        category: "web",
        language: "typescript",
        wildcardSvg: "firebase",
        projectSvg: "datapipe",
        skills: ["Firebase", "Next.js", "OAuth2", "GitHub Actions", "REST API", "Python"],
        image: "datapipe-auth.png",
        imageAlt: "placeholder image",
        caption: "The moment of truth: finally getting the OAuth to work and access the OSF.",
    },
    {
        name: "oquest-builder",
        description: [
            "A lot of my free time in the past was spent on Minecraft servers with my friends, particularly with a group of people who owned a server " +
                "themselves. One day, they had an issue concerning building .yml files for the plugin O'DailyQuests, as a lot of the team didn't have " +
                "technical expertise and couldn't follow the format consistently.",
            "To help bridge the gap between technical documentation and non-technical end user, I created oquest-builder, a Next.js app written in " +
                "JavaScript that helped my friends just do that. You can select a quest type, and it will display the required fields in an easy to " +
                "read form. You can add multiple fields for those that require it, and at the end, export to either a copyable text, or a .yml file.",
            "They loved it, and were able to produce hundreds of quests in under an hour from this workflow simplification.",
        ],
        category: "game",
        language: "javascript",
        wildcardSvg: "nextjs",
        projectSvg: "minecraft",
        skills: ["Next.js"],
        image: "oquest-builder-form.png",
        imageAlt: "placeholder image",
        caption:
            "An example of the form being used to create a quest to search for pufferfish. This will get turned into a proper .yml format that can be copied or exported.",
        linkText: "try it on the web!",
        projectLink: "https://mellow-zuccutto-1f0574.netlify.app/",
    },
];
