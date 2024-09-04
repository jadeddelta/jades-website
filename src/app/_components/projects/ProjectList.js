/*
    projectList is a list of rows of projects (in a 2D array)
    each project is of the structure:
    {
        name: string -> name of the project,
        simpleDescription: string -> a simple description of the project (displayed on the non-expanded card),
        complexDescription: string[] -> a more detailed description of the project (expanded card),
        skills: string[] -> list of skills used in the project (first few are displayed non-expanded),
        link: string -> link to the project,
        frontImage: string -> link to the front image of the project (non-expanded card),
        internalImage: string -> link to the internal image of the project (expanded card),
        major: boolean -> whether the project is a major project or not,
        insight: string -> link to the insights page of this project 
    }
*/
export const projectList = [
    [
        {
            name: "Eyetracking with Machine Learning",
            simpleDescription: "Researched into creating web camera eyetracking for all.",
            complexDescription: [
                "Working under Vassar College's Undergraduate Research Summer Institute program for "
                + "two summers over two teams, we attempted to create a deep learning model that could "
                + "accurately predict the gaze of a user given a webcam feed.",
                "Our data gathering consisted of using Prolific to host jsPsych experiments, collecting "
                + "data of users looking at various points on the screen. Our first summer consisted of us "
                + "tinkering with simple CNN embedding models and LSTM models, along with our first ETL pipelines.",
                "We were able to achieve around 18% distance error with our final models of the first summer. Afterwards, "
                + "we transitioned towards custom architectures and loss functions and more varied, modular data pipelines. "
                + "We presented our final model with a 7.18% normalized Euclidean distance error to the symposium."
            ],
            skills: ["Python", "TensorFlow", "Keras", "OpenCV", "SLURM", "JavaScript", "Machine Learning Research"],
            link: "some link",
            frontImage: "some image",
            internalImage: "/internal-images/eyetracking-triplet-loss.png",
            internalAlt: "eyetracking triplet loss visualization",
            internalCaption: "Depiction of our custom triplet loss function. The loss function is "
                + "minimized when the blue anchor point is closer to the green positive point "
                + "than the red negative point.",
            major: true,
            insight: "",
            mediaButton: "see our poster!",
            mediaLink: ""
        },
        {
            name: "ASA Datafest 2024",
            simpleDescription: "Utilized NetworkX and pandas to analyze student web traffic data.",
            complexDescription: [
                "Over the weekend, we conducted data analysis on a dataset provided by CourseKata, "
                + "a web-based statistics course. The dataset consisted of student web traffic data, "
                + "survey, and performance data.",
                "On a team of 5 other students, my work primarily focused on data analysis and visualization. "
                + "I used pandas to clean up and organize the data into individual student timelines, and then "
                + "created a directed graph using that data.",
                "In Jupyter, I used both NetworkX and matplotlib to visualize the data, showing chapters "
                + "that students would commonly return to while trying to complete a specific chapter. "
                + "This information is useful as CourseKata can optimize their course by providing hints to "
                + "reduce users moving from page to page. "
                + "With this information, we won the award for Best Analysis!"
            ],
            skills: ["Python", "Jupyter Notebook", "pandas", "NetworkX", "matplotlib", "Data Analysis"],
            link: "",
            frontImage: "",
            internalImage: "/internal-images/asa-chapter5-graph.png",
            internalAlt: "data visualization network graph",
            internalCaption: "A graph of which sections students would commonly "
                + "return to while trying to complete Chapter 5. ",
            major: false,
            insight: "",
            mediaButton: "",
            mediaLink: ""
        }
    ],
    [
        {
            name: "Vassar Turing Machine Simulator",
            simpleDescription: "Revamping an old college-owned website using modern React and Redux.",
            complexDescription: [
                "For my job at Vassar College's Cognitive Science Department, I was tasked with updating "
                + "a 7 year old website running on React v14 and Redux v3 to the latest versions, with "
                + "modern practices and design.",
                "The main goal was to keep the same functionality and design of the old website, but "
                + "eventually evolved to include a more modern design and a more consistent user experience. ",
                "This included aspects such as clear and intuitive test creation and display, consistent themeing, "
                + "and a more modular and maintainable codebase. The website is currently still in development as of "
                + "July 2024."
            ],
            skills: ["JavaScript", "Nextjs", "React", "Redux", "MaterialUI", "Web Development"],
            link: "",
            frontImage: "",
            internalImage: "/internal-images/turing-machine-tests.png",
            internalAlt: "updated testing display of the Turing Machine Simulator",
            internalCaption: "A new version of the testing suite, with intuitive test status icons "
                + "and a specific field for error codes.",
            major: false,
            insight: "",
            mediaButton: "indev",
            mediaLink: "indev"
        },
        {
            name: "jsPsych Development",
            simpleDescription: "Assisted in developing for largest open-source web package for behavioral research.",
            complexDescription: [
                "After being introduced to jsPsych through the first summer of my eyetracking research, "
                + "I decided to make contributions to the open-source project as my first endeavor into "
                + "the FOSS community.",
                "My initial contributions were small, such as fixing typos and bugs in the documentation website, "
                + "and rewording certain vocabulary to be more consistent. When adding npmjs descriptors for "
                + "every plugin, also began direct code contributions, starting with quality of life improvements to the Cloze plugin. ",
                "While jsPsych prepares for a major update, I will continue to develop my JavaScript skills "
                + "(such as through this website) until the project is ready for more contributions."
            ],
            skills: ["TypeScript", "Unit Testing w/ Jest", "Web Development"],
            link: "",
            frontImage: "",
            internalImage: "/internal-images/jspsych-cloze-test.png",
            internalAlt: "a cloze test in jsPsych, showing a passage with boxes for missing words to fill in.",
            internalCaption: "An example of the Cloze plugin, where users fill in blanks of a passage. "
                + "I made contributions to this plugin as one of my first pull requests.",
            major: true,
            insight: "",
            mediaButton: "",
            mediaLink: ""
        }
    ],
    [
        {
            name: "Amethyst, A Focus Timer",
            simpleDescription: "Constructed a unique pomodoro time management app with gamefied break periods.",
            complexDescription: [
                "For Vassar's CMPU-203 class, Software Design and Implementation, students were paired up "
                + "and tasked to create an app in Android Studio. My partner and I decided to create a pomodoro timer "
                + "with a twist: gamefied break periods.",
                "Pomodoro apps are known for their simplistic yet efficient time blocking techniques, but having 5 or "
                + "so minutes for a break period seems too low. We decided to create a game in order to give the user "
                + "an option for a structured yet relaxing break period.",
                "I primarily handled the game development aspect of the project, creating a Match-3 game that had "
                + "legal start board states, and a combo/level system that acted as a reward for the user."
                + "The app was presented at the end of the semester, and was well received by the class."
            ],
            skills: ["Java", "Android Studio", "Game/App Development"],
            link: "",
            frontImage: "",
            internalImage: "/internal-images/amethyst-title-screen.png",
            internalAlt: "homepage of the time management app, showing a purple gem and the title Amethyst.",
            internalCaption: "The homepage of the app. Back then, my primary design program was paint.net, "
                + "so the design focuses on simplicity and clarity.",
            major: false,
            insight: "",
            mediaButton: "",
            mediaLink: ""
        },
        {
            name: "Talkative in MLH Hackathon",
            simpleDescription: "Designed and implemented a chatbot that can assist users with the way they speak.",
            complexDescription: [
                "In 2022, I participated in my first hackathon (MLH Hack with a Crew) with 2 friends. "
                + "The theme given was similar to community, and we decided to develop a chatbot that "
                + "could assist users in speaking more clearly and confidently.",
                "Talkative, our chatbot, would use sentiment analysis using Cohere's API to determine "
                + "the mood of the user's texts, and report this feedback to the user. This would "
                + "be especially useful for people with speech impediments or social anxiety.",
                "This was my first endeavor into UI/UX design, and I was able to create a simple yet effective "
                + "login screen for the chatbot. We were able to present our project at the end of the hackathon, "
                + "and won the award for 'Best Use of Natural Langauge Processing.'"
            ],
            skills: ["JavaScript", "Figma", "Natural Language Processing", "UI/UX Design"],
            link: "",
            frontImage: "",
            internalImage: "/internal-images/talkative-login-screen.png",
            internalAlt: "talkative login screen, showing simple login fields",
            internalCaption: "",
            major: false,
            insight: "",
            mediaButton: "",
            mediaLink: ""
        },
        {
            name: "YAPPER Chess Program",
            simpleDescription: "Created basic Chess engines along with a framework to compare representations.",
            complexDescription: [
                "My first advanced elective at Vassar involved creating a chess engine in Java with a group. "
                + "The class's structure was research-oriented, focusing on different representations of "
                + "the parts of the chess engine.",
                "At the start, I created a basic chess engine that used arrays and "
                + "integers to represent the board and pieces. When I realized that the rest of my group "
                + "had not finished anything by the midpoint, I had to work independent,",
                "pivoting to a comparison based approach. I created a framework using OOP principles "
                + "that allowed for comparison between multiple versions of the board. "
                + "In the end, I was able to do that with two different board representations."
            ],
            skills: ["Java", "Gradle", "Search Algorithms", "IntelliJ IDEA", "Software Development"],
            link: "",
            frontImage: "",
            internalImage: "/internal-images/chess-cli.png",
            internalAlt: "command line interface of the YAPPER chess program",
            internalCaption: "YAPPER's (Yet Another Paradigm Procuring chEss Representations) CLI interface.",
            major: false,
            insight: "",
            mediaButton: "",
            mediaLink: ""
        }
    ]
]

const projectMap = {
    "Web Development": "web",
    "Machine Learning Research": "ml",
    "Data Analysis": "data",
    "Game/App Development": "game",
    "Software Development": "sd",
    "UI/UX Design": "ui",
}

export const getProjectClass = (skill) => {
    return projectMap[skill];
}