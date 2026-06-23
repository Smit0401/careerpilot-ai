import { useMemo, useState } from "react"
import { InterviewContext } from "./interview.context"

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const value = useMemo(() => ({
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
    }), [loading, report, reports])

    return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>
}
