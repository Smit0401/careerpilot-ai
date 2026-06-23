import { useCallback, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./auth.context"
import { getMe, login, logout, register } from "./services/auth.api"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleLogin = useCallback(async (credentials) => {
        const data = await login(credentials)
        setUser(data.user)
        return data.user
    }, [])

    const handleRegister = useCallback(async (details) => {
        const data = await register(details)
        setUser(data.user)
        return data.user
    }, [])

    const handleLogout = useCallback(async () => {
        await logout()
        setUser(null)
    }, [])

    useEffect(() => {
        let active = true

        getMe()
            .then((data) => {
                if (active) setUser(data.user)
            })
            .catch(() => {
                if (active) setUser(null)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [])

    const value = useMemo(() => ({
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
    }), [user, loading, handleLogin, handleRegister, handleLogout])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
