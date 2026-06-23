import { useCallback, useMemo, useState } from "react"
import { ToastContext } from "./toast.context"

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = "info") => {
        const id = crypto.randomUUID()
        setToasts((current) => [...current, { id, message, type }])
        window.setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id))
        }, 4500)
    }, [])

    const value = useMemo(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-region" aria-live="polite" aria-atomic="true">
                {toasts.map((toast) => (
                    <div className={`toast toast--${toast.type}`} key={toast.id}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
