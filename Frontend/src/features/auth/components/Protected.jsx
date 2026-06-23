import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (
            <main className="center-state">
                <div className="spinner" aria-label="Checking your session" />
            </main>
        )
    }

    if(!user){
        return <Navigate to="/login" replace />
    }
    
    return children
}

export default Protected
