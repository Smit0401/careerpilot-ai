const { getYoutubeVideos } = require("../services/youtube.service")

async function getLearningResources(req, res) {
    const { topic } = req.query

    if (!topic) {
        return res.status(400).json({
            message: "Topic is required"
        })
    }

    const videos = await getYoutubeVideos(topic)

    res.status(200).json({
        message: "Learning resources fetched successfully",
        topic,
        videos
    })
}

module.exports = {
    getLearningResources
}