import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router"
import { useToast } from "../../../components/toast.context"
import { getErrorMessage } from "../../../services/api"
import "../auth.form.scss"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
    const { user, loading, handleLogin } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const location = useLocation()
    const [submitting, setSubmitting] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    if (!loading && user) return <Navigate to="/" replace />

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        try {
            await handleLogin({ email: email.trim(), password })
            showToast("Welcome back", "success")
            navigate(location.state?.from || "/", { replace: true })
        } catch (error) {
            showToast(getErrorMessage(error, "Login failed"), "error")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-panel">
                <Link className="brand auth-brand" to="/">
                    <span className="brand-mark">CP</span>
                    <span>CareerPilot <strong>AI</strong></span>
                </Link>
                <p className="eyebrow">Welcome back</p>
                <h1>Continue your interview prep</h1>
                <p className="auth-copy">Sign in to generate tailored plans and revisit your previous reports.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email address</label>
                        <input value={email} onChange={(event) => setEmail(event.target.value)}
                            type="email" id="email" autoComplete="email" required placeholder="you@example.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input value={password} onChange={(event) => setPassword(event.target.value)}
                            type="password" id="password" autoComplete="current-password" minLength={8} required placeholder="At least 8 characters" />
                    </div>
                    <button disabled={submitting || loading} className="button primary-button">
                        {submitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
                <p className="auth-switch">New to CareerPilot? <Link to="/register">Create an account</Link></p>
            </section>
        </main>
    )
}

export default Login
