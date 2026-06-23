import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import { useToast } from "../../../components/toast.context"
import { getErrorMessage } from "../../../services/api"
import { useInterview } from "../hooks/useInterview"
import "../style/home.scss"

export default function History() {
    const { loading, reports, getReports } = useInterview()
    const { showToast } = useToast()
    const [query, setQuery] = useState("")
    const [score, setScore] = useState("all")

    useEffect(() => {
        getReports().catch((error) => showToast(getErrorMessage(error, "Could not load reports"), "error"))
    }, [getReports, showToast])

    const filteredReports = useMemo(() => reports.filter((report) => {
        const matchesQuery = (report.title || "Untitled position").toLowerCase().includes(query.toLowerCase())
        const matchesScore = score === "all"
            || (score === "strong" && report.matchScore >= 80)
            || (score === "potential" && report.matchScore >= 60 && report.matchScore < 80)
            || (score === "develop" && report.matchScore < 60)
        return matchesQuery && matchesScore
    }), [reports, query, score])

    return (
        <main className="page-container">
            <header className="section-heading">
                <div>
                    <p className="eyebrow">Report library</p>
                    <h1>Your interview reports</h1>
                    <p>Search previous role analyses and continue preparing where you left off.</p>
                </div>
                <Link className="button primary-button" to="/">Generate report</Link>
            </header>
            <div className="report-filters">
                <label>
                    <span className="sr-only">Search reports</span>
                    <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by role..." />
                </label>
                <select value={score} onChange={(event) => setScore(event.target.value)} aria-label="Filter by match score">
                    <option value="all">All match scores</option>
                    <option value="strong">Strong: 80%+</option>
                    <option value="potential">Potential: 60-79%</option>
                    <option value="develop">Develop: below 60%</option>
                </select>
            </div>
            {loading && reports.length === 0 ? (
                <div className="report-grid">{[1, 2, 3].map((item) => <div className="report-card skeleton" key={item} />)}</div>
            ) : filteredReports.length ? (
                <div className="report-grid">
                    {filteredReports.map((report) => <ReportCard report={report} key={report._id} />)}
                </div>
            ) : (
                <div className="empty-state">
                    <h2>No reports found</h2>
                    <p>{reports.length ? "Try a different search or score filter." : "Generate your first report to start building your preparation library."}</p>
                    {!reports.length && <Link className="button primary-button" to="/">Create first report</Link>}
                </div>
            )}
        </main>
    )
}

export function ReportCard({ report }) {
    return (
        <Link className="report-card" to={`/interview/${report._id}`}>
            <div className="report-card-top">
                <span className="report-icon">AI</span>
                <span className={`score-pill score-pill--${report.matchScore >= 80 ? "high" : report.matchScore >= 60 ? "mid" : "low"}`}>
                    {report.matchScore}% match
                </span>
            </div>
            <h3>{report.title || "Untitled position"}</h3>
            <p>Generated {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</p>
            <span className="text-link">Open report <span aria-hidden="true">→</span></span>
        </Link>
    )
}
