import { useState } from "react"
import "../style/selfStudy.scss"
import { generateStudyPlan } from "../services/selfStudy.api"
import { getLearningResources, getArticles } from "../../interview/interview.resources.api"
export default function SelfStudy() {

    const [topic, setTopic] = useState("")
    const [dailyTime, setDailyTime] = useState("1 hour")
    const [goal, setGoal] = useState("Placement Preparation")
    const [studyPlan, setStudyPlan] = useState(null)
    const [videos, setVideos] = useState([])
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)

    const handleStudy = async () => {

        try {

            setLoading(true)

            const plan = await generateStudyPlan({
                topic,
                dailyTime,
                goal
            })

            setStudyPlan(plan)

            const [videoResponse, articleResponse] =
                await Promise.all([
                    getLearningResources(topic),
                    getArticles(topic)
                ])

            setVideos(videoResponse.videos)
            setArticles(articleResponse.articles)

        }
        catch (error) {

            console.error(error)

        }
        finally {

            setLoading(false)

        }

    }
    return (

        <main className="self-study-page">

            <section className="self-study-card">

                <h1>Learn Any Topic</h1>

                <p>
                    Generate a personalized roadmap with videos and docs.
                </p>

                <div className="input-group">

                    <label>Topic</label>

                    <input
                        type="text"
                        placeholder="Ex: Docker, React Hooks, Transformers"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />

                </div>

                <div className="input-group">

                    <label>Daily Time</label>

                    <select
                        value={dailyTime}
                        onChange={(e) => setDailyTime(e.target.value)}
                    >
                        <option>30 min</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>3 hours</option>
                    </select>

                </div>

                <div className="input-group">

                    <label>Goal</label>

                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    >
                        <option>Placement Preparation</option>
                        <option>Interview Preparation</option>
                        <option>Project Building</option>
                        <option>Academic Learning</option>
                    </select>

                </div>

                <button
                    className="study-btn"
                    onClick={handleStudy}
                >

                    {loading ? "Generating..." : "Let's Study"}

                </button>

            </section>
            {
        studyPlan && (

            <section className="study-result">

                <h2>{studyPlan.topic}</h2>

                <div className="overview">

                    <div>
                        <strong>Difficulty</strong>
                        <p>{studyPlan.difficulty}</p>
                    </div>

                    <div>
                        <strong>Estimated Time</strong>
                        <p>{studyPlan.estimatedTime}</p>
                    </div>

                </div>

                <h3>Prerequisites</h3>

                <ul>

                    {
                        studyPlan.prerequisites.map(prerequisite => (

                            <li key={prerequisite}>
                                {prerequisite}
                            </li>

                        ))
                    }

                </ul>

                <h3>Roadmap</h3>

                {
                    studyPlan.roadmap.map(step => (

                        <div
                            className="roadmap-card"
                            key={step.order}
                        >

                            <h4>
                                {step.order}. {step.topic}
                            </h4>

                            <p>
                                {step.description}
                            </p>

                        </div>

                    ))
                }
                <h3>Recommended Videos</h3>

                    <div className="video-list">

                        {
                            videos.map(video => (

                                <a
                                    key={video.url}
                                    href={video.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="video-card"
                                >

                                    <div className="video-channel">
                                        {video.channel}
                                    </div>

                                    <div className="video-title">
                                        {video.title}
                                    </div>

                                </a>

                            ))
                        }

                    </div>
                    <h3>Recommended Docs</h3>

                        <div className="article-list">

                            {
                                articles.map(article => (

                                    <a
                                        key={article.url}
                                        href={article.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="article-card"
                                    >

                                        <div className="article-source">
                                            {article.source}
                                        </div>

                                        <div className="article-title">
                                            {article.title}
                                        </div>

                                    </a>

                                ))
                            }

                        </div>

            </section>

        )
    }

        </main>

    )

}