import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useToast } from "../../../components/toast.context"
import { getErrorMessage } from "../../../services/api"
import { useInterview } from "../hooks/useInterview"
import "../style/interview.scss"
import {
    getLearningResources,
    getArticles
} from "../interview.resources.api"


const NAV_ITEMS = [
    { id: "technical", label: "Technical questions" },
    { id: "behavioral", label: "Behavioral questions" },
    { id: "learning", label: "Learning Plan" },
    { id: "roadmap", label: "Preparation plan" }
    
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <article className="q-card">
            <button className="q-card__header" onClick={() => setOpen((current) => !current)}
                aria-expanded={open}>
                <span className="q-card__index">Q{index + 1}</span>
                <span className="q-card__question">{item.question}</span>
                <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`} aria-hidden="true">⌄</span>
            </button>
            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">What they are assessing</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Answer strategy</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </article>
    )
}

const RoadMapDay = ({ day }) => (
    <article className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">Day {day.day}</span>
            <h3 className="roadmap-day__focus">{day.focus}</h3>
        </div>
        <ul className="roadmap-day__tasks">
            {day.tasks.map((task) => <li key={task}>{task}</li>)}
        </ul>
    </article>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState("technical")
    const [resources, setResources] = useState({})
    const [loadError, setLoadError] = useState("")
    const [openVideos, setOpenVideos] = useState({})
    const [articles, setArticles] = useState({})
    const [openDocs, setOpenDocs] = useState({})
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { showToast } = useToast()
    const { interviewId } = useParams()

    useEffect(() => {
        getReportById(interviewId)
            .then(() => setLoadError(""))
            .catch((error) => setLoadError(getErrorMessage(error, "Could not load this report")))
    }, [getReportById, interviewId])
    

    const downloadResume = async () => {
        try {
            await getResumePdf(interviewId)
            showToast("Resume downloaded", "success")
        } catch (error) {
            showToast(getErrorMessage(error, "Could not generate resume"), "error")
        }
    }

    const handleVideoToggle = async (topic) => {

        setOpenVideos(prev => ({
            ...prev,
            [topic]: !prev[topic]
        }));

        // Already loaded
        if (resources[topic]) return;

        try {

            const response = await getLearningResources(topic);

            setResources(prev => ({
                ...prev,
                [topic]: response.videos
            }));

        } catch (error) {

            console.error("Failed to load videos", error);

        }

    }
    const handleDocsToggle = async (topic) => {

        setOpenDocs(prev => ({
            ...prev,
            [topic]: !prev[topic]
        }));

        // Already loaded
        if (articles[topic]) return;

        try {

            const response = await getArticles(topic);

            setArticles(prev => ({
                ...prev,
                [topic]: response.articles
            }));

        } catch (error) {

            console.error("Failed to load articles", error);

        }

    }
    if (loading && !report) {
        return (
            <main className="page-container">
                <div className="report-detail-skeleton skeleton" />
            </main>
        )
    }

    if (loadError || !report) {
        return (
            <main className="center-state">
                <div className="state-card">
                    <p className="eyebrow">Report unavailable</p>
                    <h1>{loadError || "This report could not be found."}</h1>
                    <Link className="button primary-button" to="/reports">Back to reports</Link>
                </div>
            </main>
        )
    }

    const questions = activeNav === "technical" ? report.technicalQuestions : report.behavioralQuestions
    const scoreTone = report.matchScore >= 80 ? "high" : report.matchScore >= 60 ? "mid" : "low"
    const scoreLabel = report.matchScore >= 80 ? "Strong alignment" : report.matchScore >= 60 ? "Good potential" : "Growth opportunity"

    return (
        <main className="page-container report-page">
            <header className="report-hero">
                <div>
                    <Link className="back-link" to="/reports">← All reports</Link>
                    <p className="eyebrow">Interview report</p>
                    <h1>{report.title}</h1>
                    <p>Generated {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</p>
                </div>
                <button onClick={downloadResume} disabled={loading} className="button secondary-button">
                    {loading ? "Preparing..." : "Download tailored resume"}
                </button>
            </header>

            <div className="report-layout">
                <aside className="report-sidebar">
                    <section className="score-card">
                        <div className={`score-ring score-ring--${scoreTone}`}
                            style={{ "--score": `${report.matchScore * 3.6}deg` }}>
                            <div><strong>{report.matchScore}</strong><span>%</span></div>
                        </div>
                        <div>
                            <p className="eyebrow">Match score</p>
                            <h2>{scoreLabel}</h2>
                        </div>
                    </section>
                    <section className="gaps-card">
                        <p className="eyebrow">Priority skill gaps</p>
                        <div className="skill-gaps">
                            {report.skillGaps.length ? report.skillGaps.map((gap) => (
                                <div className="skill-gap" key={`${gap.skill}-${gap.severity}`}>
                                    <span>{gap.skill}</span>
                                    <span className={`severity severity--${gap.severity}`}>{gap.severity}</span>
                                </div>
                            )) : <p>No significant gaps identified.</p>}
                        </div>
                    </section>
                    {/* <section className="learning-plan-card">
                        <p className="eyebrow">Learn Next</p>

                        {report.priorityLearningPlan?.length ? (
                            <div className="learning-plan-list">
                                {report.priorityLearningPlan.map((item) => (
                                    <div
                                    key={`${item.topic}-${item.learningOrder}`}
                                    className="learning-plan-item"
                                >
                                    <div className="learning-plan-header">

                                        <span className="learning-order">
                                            #{item.learningOrder}
                                        </span>

                                        <span className={`priority priority--${item.priority}`}>
                                            {item.priority}
                                        </span>

                                    </div>

                                    <h3>{item.topic}</h3>

                                    <p>{item.reason}</p>

                                    <small>
                                        Estimated Time: {item.estimatedTime}
                                    </small>

                                    <div className="learning-videos">

                                        <h4>Recommended Videos</h4>

                                        {resources[item.topic]?.length ? (

                                            resources[item.topic].map((video) => (
                                                <a
                                                    key={video.url}
                                                    href={video.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="video-link"
                                                >
                                                    ▶ {video.title}
                                                </a>
                                            ))

                                        ) : (

                                            <p>Loading videos...</p>

                                        )}

                                    </div>

                                </div>
                                ))}
                            </div>
                        ) : (
                            <p>No learning recommendations available.</p>
                        )}
                    </section> */}
                </aside>

                <section className="report-content">
                    <div className="report-tabs" role="tablist" aria-label="Report sections">
                        {NAV_ITEMS.map((item) => (
                            <button role="tab" aria-selected={activeNav === item.id} key={item.id}
                                className={activeNav === item.id ? "active" : ""}
                                onClick={() => setActiveNav(item.id)}>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    {activeNav === "learning" ? (
                    <div>
                        <div className="content-header">
                            <h2>Priority Learning Plan</h2>
                            <span>
                                {report.priorityLearningPlan?.length || 0} topics
                            </span>
                        </div>
                        
                        <div className="learning-plan-list">
                            {report.priorityLearningPlan?.map((item) => (
                                <div
                                    key={`${item.topic}-${item.learningOrder}`}
                                    className="learning-plan-item"
                                >
                                    <div className="learning-plan-header">
                                        <span className="learning-order">
                                            #{item.learningOrder}
                                        </span>

                                        <span
                                            className={`priority priority--${item.priority}`}
                                        >
                                            {item.priority}
                                        </span>
                                    </div>

                                    <h3>{item.topic}</h3>

                                    <p>{item.reason}</p>

                                    <small>
                                        Estimated Time: {item.estimatedTime}
                                    </small>

                                    <div className="learning-videos">

                                            <button
                                                className="video-dropdown-btn"
                                                onClick={() => handleVideoToggle(item.topic)}
                                            >
                                                {openVideos[item.topic] ? "▼" : "▶"} Recommended Videos
                                            </button>

                                            {openVideos[item.topic] && (

                                                resources[item.topic]?.length ? (

                                                    <div className="video-list">

                                                        {resources[item.topic].map(video => (

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

                                                        ))}

                                                    </div>

                                                ) : (

                                                    <p>Loading videos...</p>

                                                )

                                            )}

                                        </div>
                                        <div className="learning-docs">

                                        <button
                                            className="video-dropdown-btn"
                                            onClick={() => handleDocsToggle(item.topic)}
                                        >
                                            {openDocs[item.topic] ? "▼" : "▶"} Recommended Articles & Docs
                                        </button>
                                        {openDocs[item.topic] && (

                                            <>

                                                {articles[item.topic] === undefined ? (

                                                    <p>Loading articles...</p>

                                                ) : articles[item.topic].length === 0 ? (

                                                    <p>No articles found.</p>

                                                ) : (

                                                    <div className="article-list">

                                                        {articles[item.topic].map(article => (

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

                                                        ))}

                                                    </div>

                                                )}

                                            </>

                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeNav === "roadmap" ? (
                    <div>
                        <div className="content-header">
                            <h2>Your preparation plan</h2>
                            <span>{report.preparationPlan.length} days</span>
                        </div>

                        <div className="roadmap-list">
                            {report.preparationPlan.map((day) => (
                                <RoadMapDay key={day.day} day={day} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="content-header">
                            <h2>
                                {activeNav === "technical"
                                    ? "Technical questions"
                                    : "Behavioral questions"}
                            </h2>

                            <span>{questions.length} questions</span>
                        </div>

                        <div className="q-list">
                            {questions.map((question, index) => (
                                <QuestionCard
                                    key={`${question.question}-${index}`}
                                    item={question}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                )}
                </section>
            </div>
        </main>
    )   
}

export default Interview
