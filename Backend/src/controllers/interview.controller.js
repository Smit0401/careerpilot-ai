const pdfParse = require("pdf-parse")
const mongoose = require("mongoose")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

function badRequest(message) {
    const error = new Error(message)
    error.status = 400
    return error
}

async function extractResumeText(file) {
    if (!file) return ""

    const parser = new pdfParse.PDFParse({ data: Uint8Array.from(file.buffer) })
    try {
        const content = await parser.getText()
        return content.text.trim()
    } finally {
        await parser.destroy()
    }
}



/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    const jobDescription = req.body.jobDescription?.trim()
    const selfDescription = req.body.selfDescription?.trim() || ""

    if (!jobDescription || jobDescription.length < 40) {
        throw badRequest("Job description must be at least 40 characters")
    }
    if (jobDescription.length > 10000 || selfDescription.length > 5000) {
        throw badRequest("Provided text is too long")
    }
    if (!req.file && !selfDescription) {
        throw badRequest("Upload a PDF resume or provide a self description")
    }

    const resume = await extractResumeText(req.file)
    if (req.file && !resume) {
        throw badRequest("No readable text was found in the PDF")
    }

    const interViewReportByAi = await generateInterviewReport({
        resume,
        selfDescription,
        jobDescription
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params
    if (!mongoose.isValidObjectId(interviewId)) {
        throw badRequest("Invalid report identifier")
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params
    if (!mongoose.isValidObjectId(interviewReportId)) {
        throw badRequest("Invalid report identifier")
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
