import { NavLink, Outlet, useNavigate } from "react-router"
import { useAuth } from "../features/auth/hooks/useAuth"
import { getErrorMessage } from "../services/api"
import { useToast } from "./toast.context"

export default function AppShell() {
    const { user, handleLogout } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            await handleLogout()
            navigate("/login")
        } catch (error) {
            showToast(getErrorMessage(error, "Could not log out"), "error")
        }
    }

    return (
        <div className="app-shell">
            <header className="topbar">
                <NavLink className="brand" to="/">
                    <span className="brand-mark">CP</span>
                    <span>CareerPilot <strong>AI</strong></span>
                </NavLink>
                <nav className="topbar-nav" aria-label="Primary navigation">

                    <NavLink to="/" end>
                        Dashboard
                    </NavLink>

                    <NavLink to="/reports">
                        Reports
                    </NavLink>

                    <NavLink to="/self-study">
                        Self Study
                    </NavLink>

                </nav>
                <div className="user-menu">
                    <span className="user-avatar" aria-hidden="true">
                        {user?.username?.charAt(0).toUpperCase()}
                    </span>
                    <span className="user-name">{user?.username}</span>
                    <button className="button ghost-button" onClick={onLogout}>Log out</button>
                </div>
            </header>
            <Outlet />
        </div>
    )
}
