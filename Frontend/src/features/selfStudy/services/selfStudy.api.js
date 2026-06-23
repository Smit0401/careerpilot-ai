import { api } from "../../../services/api"

export async function generateStudyPlan(data) {

    const response = await api.post(
        "/api/self-study",
        data
    )

    return response.data.studyPlan

}