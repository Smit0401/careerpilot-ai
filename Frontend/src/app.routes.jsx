import { createBrowserRouter, Navigate } from "react-router"
import AppShell from "./components/AppShell"
import Protected from "./features/auth/components/Protected"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import History from "./features/interview/pages/History"
import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/Interview"
import SelfStudy from "./features/selfStudy/pages/SelfStudy.jsx"

export const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
        element: <Protected><AppShell /></Protected>,
        children: [
            { path: "/", element: <Home /> },
            { path: "/reports", element: <History /> },
            { path: "/self-study", element: <SelfStudy /> },
            { path: "/interview/:interviewId", element: <Interview /> },
        ]
    },
    { path: "*", element: <Navigate to="/" replace /> }
])
