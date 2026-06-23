import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useToast } from "../../../components/toast.context"
import { getErrorMessage } from "../../../services/api"
import "../auth.form.scss"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
    const { user, loading, handleRegister } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    if (!loading && user) return <Navigate to="/" replace />

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        try {
            await handleRegister({ username: username.trim(), email: email.trim(), password })
            showToast("Your account is ready", "success")
            navigate("/", { replace: true })
        } catch (error) {
            showToast(getErrorMessage(error, "Registration failed"), "error")
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
                <p className="eyebrow">Get started</p>
                <h1>Prepare with a clearer plan</h1>
                <p className="auth-copy">Create your workspace for AI-powered role matching and interview preparation.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Name</label>
                        <input value={username} onChange={(event) => setUsername(event.target.value)}
                            type="text" id="username" autoComplete="name" minLength={2} maxLength={50} required placeholder="Your name" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email address</label>
                        <input value={email} onChange={(event) => setEmail(event.target.value)}
                            type="email" id="email" autoComplete="email" required placeholder="you@example.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input value={password} onChange={(event) => setPassword(event.target.value)}
                            type="password" id="password" autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" />
                    </div>
                    <button disabled={submitting || loading} className="button primary-button">
                        {submitting ? "Creating account..." : "Create account"}
                    </button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
            </section>
        </main>
    )
}

export default Register
