import { api } from "../../services/api"

export async function getLearningResources(topic) {

    const response = await api.get(
        `/api/learning?topic=${encodeURIComponent(topic)}`
    )

    return response.data

}

export async function getArticles(topic) {

    const response = await api.get(
        `/api/articles?topic=${encodeURIComponent(topic)}`
    )

    return response.data

}