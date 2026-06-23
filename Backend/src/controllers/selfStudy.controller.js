const { generateStudyPlan } = require("../services/selfStudy.service")

async function generateStudyPlanController(req, res) {

    const {
        topic,
        dailyTime,
        goal
    } = req.body

    if (!topic) {

        return res.status(400).json({
            message: "Topic is required"
        })

    }

    const studyPlan = await generateStudyPlan({
        topic,
        dailyTime,
        goal
    })

    res.status(200).json({
        message: "Study plan generated successfully",
        studyPlan
    })

}

module.exports = {
    generateStudyPlanController
}