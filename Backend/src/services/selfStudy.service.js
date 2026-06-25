const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod/v3")
const { zodToJsonSchema } = require("zod-to-json-schema")
const { generateWithRetry } = require("../utils/geminiRetry")
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const studyPlanSchema = z.object({
    topic: z.string(),

    difficulty: z.enum([
        "Beginner",
        "Intermediate",
        "Advanced"
    ]),

    estimatedTime: z.string(),

    prerequisites: z.array(
        z.string()
    ),

    roadmap: z.array(
        z.object({
            order: z.number(),
            topic: z.string(),
            description: z.string()
        })
    )
})
async function generateStudyPlan({
    topic,
    dailyTime,
    goal
}) {

    const prompt = `
Generate a study plan.

Topic:
${topic}

Daily Time:
${dailyTime}

Goal:
${goal}

Instructions:

1. Estimate realistic completion time.
2. Assign difficulty.
3. Generate prerequisites.
4. Generate roadmap.
5. Keep roadmap practical and interview-oriented.
`

    const response = await generateWithRetry(ai, {
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(
                studyPlanSchema
            ),
            maxOutputTokens: 2048
        }
    })

    const jsonContent = JSON.parse(response.text)

    return studyPlanSchema.parse(jsonContent)
}
module.exports = {
    generateStudyPlan
}