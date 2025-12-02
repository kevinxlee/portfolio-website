import './AboutPage.css'
function AboutPage({ darkMode }: { darkMode: boolean }) {
    return <div className="about-container">
        <h1>About me</h1>
        <p>
            Hello! I'm a passionate software developer with a love for creating dynamic and user-friendly web applications. With experience in various programming languages and frameworks, I enjoy solving complex problems and continuously learning new technologies.
        </p>
        <p>
            In my free time, I like to contribute to open-source projects, explore new programming paradigms, and stay updated with the latest trends in the tech industry.
        </p>
        <p>
            Feel free to reach out if you'd like to collaborate on a project or just want to connect!
        </p>
    </div>;
}

export default AboutPage;