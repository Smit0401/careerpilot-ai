import { useCallback, useContext } from "react"
import { InterviewContext } from "../interview.context"
import {
    generateInterviewReport,
    generateResumePdf,
    getAllInterviewReports,
    getInterviewReportById,
} from "../services/interview.api"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = useCallback(async (details) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport(details)
            setReport(response.interviewReport)
            setReports((current) => [response.interviewReport, ...current])
            return response.interviewReport
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport, setReports])

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            setReport(null)
            throw error
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReports])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.download = `resume_${interviewReportId}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}
