const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod/v3")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")
const { generateWithRetry } = require("../utils/geminiRetry")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// async function generateWithRetry(config, retries = 5) {

//     for (let i = 0; i < retries; i++) {

//         try {

//             return await ai.models.generateContent(config)

//         } catch (error) {

//             if (
//                 error.status === 503 &&
//                 i < retries - 1
//             ) {

//                 console.log(`Gemini overloaded. Retry ${i + 1}...`)

//                 await new Promise(resolve =>
//                     setTimeout(resolve, 5000)
//                 )

//             } else {

//                 throw error

//             }

//         }

//     }

// }
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(
    z.object({
        skill: z.string().describe(
            "The major skill area where the candidate lacks sufficient knowledge or experience"
        ),

        severity: z.enum(["low", "medium", "high"]).describe(
            "How critical this skill gap is for the target job role"
        ),

        missingTopics: z.array(
            z.string()
        ).describe(
            "Specific sub-topics, concepts, tools, or interview-relevant areas within this skill that the candidate should learn"
        )
    })
).describe(
    "List of skill gaps identified in the candidate profile, including their importance and the specific topics that need improvement"
),
    priorityLearningPlan: z.array(
    z.object({
        topic: z.string().describe("The topic that the candidate should learn"),
        priority: z.enum(["urgent", "high", "medium", "low"])
            .describe("Priority level for learning this topic"),
        reason: z.string()
            .describe("Why this topic is important for the target job"),
        estimatedTime: z.string()
            .describe("Estimated time required to learn the topic"),
        learningOrder: z.number()
            .describe("The order in which the candidate should learn the topic")
    })
).describe(
    "A prioritized roadmap of topics the candidate should learn based on skill gaps and job requirements"
),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = ` Generate an interview report for a candidate.

        Resume:
        ${resume}

        Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}

        Important Instructions:

        1. Generate realistic technical interview questions.
        2. Generate realistic behavioral interview questions.
        3. Identify skill gaps by comparing the candidate profile with the job description.
        For each skill gap:

        - Identify specific missing topics.
        - Do not return generic skills without explanation.
        - Include 3-6 interview-relevant subtopics.
        - Focus on concepts, tools, frameworks, and technologies that the candidate should learn.
        4. Create a preparation plan.

        5. Generate a Priority Learning Plan:
        - Based on the detected skill gaps.
        - Rank topics from most important to least important.
        - Focus only on skills that can significantly improve interview performance.
        - Explain why each topic matters.
        - Estimate learning time.
        - Assign learningOrder starting from 1.

        6. Do NOT generate generic advice.
        7. Do NOT include topics that the candidate already knows well.
        8. Prioritize skills explicitly mentioned in the Job Description.
        `

    const response = await generateWithRetry(ai, {
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    let parsedResponse

    try {

        const cleanedText = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()

        console.log("Gemini raw response:")
        console.log(cleanedText)

        parsedResponse = JSON.parse(cleanedText)

    } catch (err) {

        console.error("Failed to parse Gemini response:")
        console.error(response.text)

        const error = new Error("AI returned an unreadable report")
        error.status = 502
        throw error
    }

        const result = interviewReportSchema.safeParse(parsedResponse)
        if (!result.success) {
            const error = new Error("AI returned an incomplete report")
            error.status = 502
            throw error
        }

        return result.data


    }



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    })
    try {
        const page = await browser.newPage()
        await page.setJavaScriptEnabled(false)
        await page.setRequestInterception(true)
        page.on("request", (request) => {
            const url = request.url()
            if (url === "about:blank" || url.startsWith("data:")) {
                request.continue()
            } else {
                request.abort()
            }
        })
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
});

return pdfBuffer;
    } finally {
        await browser.close()
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await generateWithRetry(ai, {
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
            maxOutputTokens: 4096
        }
    })


    let jsonContent
    try {
        jsonContent = JSON.parse(response.text)
    } catch {
        const error = new Error("AI returned an unreadable resume")
        error.status = 502
        throw error
    }

    const result = resumePdfSchema.safeParse(jsonContent)
    if (!result.success) {
        const error = new Error("AI returned an incomplete resume")
        error.status = 502
        throw error
    }
    //console.log(result.data.html);
    const pdfBuffer = await generatePdfFromHtml(result.data.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }
