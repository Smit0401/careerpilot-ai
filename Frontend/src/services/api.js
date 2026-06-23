import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
    timeout: 120000,
})

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    return error.response?.data?.message || error.message || fallback
}
