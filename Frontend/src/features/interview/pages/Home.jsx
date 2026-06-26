import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useToast } from "../../../components/toast.context"
import { getErrorMessage } from "../../../services/api"
import { useAuth } from "../../auth/hooks/useAuth"
import { useInterview } from "../hooks/useInterview"
import { ReportCard } from "./History"
import "../style/home.scss"

const MAX_FILE_SIZE = 5 * 1024 * 1024

const Home = () => {
    const { user } = useAuth()
    const { loading, generateReport, reports, getReports } = useInterview()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("")

    useEffect(() => {
        getReports().catch((error) => showToast(getErrorMessage(error, "Could not load recent reports"), "error"))
    }, [getReports, showToast])

    const selectFile = (file) => {
        if (!file) return
        if (file.type !== "application/pdf") {
            showToast("Please upload a PDF resume", "error")
            return
        }
        if (file.size > MAX_FILE_SIZE) {
            showToast("Resume must be 5MB or smaller", "error")
            return
        }
        setResumeFile(file)
    }
    useEffect(() => {

        if (!loading) {
            setLoadingMessage("")
            return
        }

        const messages = [
            "📄 Reading your resume...",
            "🎯 Matching your profile with the job description...",
            "🤖 Generating technical interview questions...",
            "💬 Preparing behavioral questions...",
            "📚 Identifying skill gaps...",
            "🧠 Building your personalized learning plan..."
        ]

        let index = 0

        setLoadingMessage(messages[0])

        const interval = setInterval(() => {

            index = Math.min(index + 1, messages.length - 1)

            setLoadingMessage(messages[index])

        }, 3500)

        return () => clearInterval(interval)

    }, [loading])

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (jobDescription.trim().length < 40) {
            showToast("Add at least 40 characters of the job description", "error")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            showToast("Upload a resume or add a self description", "error")
            return
        }

        try {
            const report = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile,
            })
            showToast(
                "🎉 Interview report generated successfully!",
                "success"
            )
            navigate(`/interview/${report._id}`)
        } catch (error) {
            const message = getErrorMessage(
                error,
                "AI service is currently busy. Please try again."
            )

            showToast(message, "error")
                    }
    }

    return (
        <main className="page-container dashboard">
            <section className="welcome-section">
                <div>
                    <p className="eyebrow">AI interview workspace</p>
                    <h1>Welcome back, {user?.username}</h1>
                    <p>Turn a job description and your experience into a focused interview strategy.</p>
                </div>
                <div className="welcome-stat">
                    <strong>{reports.length}</strong>
                    <span>saved {reports.length === 1 ? "report" : "reports"}</span>
                </div>
            </section>

            <form className="generator-card" onSubmit={handleSubmit}>
                <div className="generator-heading">
                    <div>
                        <p className="eyebrow">Generate report</p>
                        <h2>Build your interview plan</h2>
                    </div>
                    <span className="secure-note">Private to your account</span>
                </div>
                <div className="generator-grid">
                    <div className="form-column">
                        <label htmlFor="jobDescription">
                            Job description <span>Required</span>
                        </label>
                        <textarea id="jobDescription" value={jobDescription}
                            onChange={(event) => setJobDescription(event.target.value)}
                            placeholder="Paste the role responsibilities, requirements, and preferred qualifications..."
                            maxLength={10000} required />
                        <div className="field-meta">
                            <span>Include the complete posting for a stronger analysis.</span>
                            <span>{jobDescription.length}/10,000</span>
                        </div>
                    </div>
                    <div className="profile-column">
                        <div className="form-column">
                            <label>Resume <span>PDF, max 5MB</span></label>
                            <button type="button"
                                className={`dropzone ${dragging ? "dropzone--active" : ""}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(event) => {
                                    event.preventDefault()
                                    setDragging(false)
                                    selectFile(event.dataTransfer.files[0])
                                }}>
                                <span className="upload-icon" aria-hidden="true">↑</span>
                                <strong>{resumeFile ? resumeFile.name : "Upload your resume"}</strong>
                                <small>{resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB selected` : "Click to browse or drag and drop"}</small>
                            </button>
                            <input ref={fileInputRef} hidden type="file" accept="application/pdf,.pdf"
                                onChange={(event) => selectFile(event.target.files[0])} />
                        </div>
                        <div className="or-divider"><span>and / or</span></div>
                        <div className="form-column">
                            <label htmlFor="selfDescription">Self description <span>Optional with resume</span></label>
                            <textarea className="short-textarea" id="selfDescription" value={selfDescription}
                                onChange={(event) => setSelfDescription(event.target.value)}
                                maxLength={5000}
                                placeholder="Summarize your experience, strengths, projects, and goals..." />
                        </div>
                    </div>
                </div>
                {loading && (
                    <div className="generation-status">

                        <div className="status-spinner" />

                        <div className="generation-content">

                            <h4>🤖 CareerPilot AI is analyzing your profile</h4>

                            <p>{loadingMessage}</p>

                            <small>
                                Please don't refresh this page. Your report is being generated securely.
                            </small>

                        </div>

                    </div>
                )}
                <div className="generator-footer">
                    <p>Analysis usually takes under a minute.</p>
                    <button className="button primary-button" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="button-spinner" />
                                {loadingMessage || "Generating report..."}
                            </>
                        ) : (
                            "Generate Interview Report"
                        )}
                    </button>
                </div>
            </form>

            <section className="recent-section">
                <div className="section-heading compact">
                    <div>
                        <p className="eyebrow">Recent activity</p>
                        <h2>Latest reports</h2>
                    </div>
                    <Link className="text-link" to="/reports">View all reports <span aria-hidden="true">→</span></Link>
                </div>
                {reports.length ? (
                    <div className="report-grid report-grid--recent">
                        {reports.slice(0, 3).map((report) => <ReportCard report={report} key={report._id} />)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>Your report library is empty</h3>
                        <p>Complete the form above to create your first tailored interview plan.</p>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Home
