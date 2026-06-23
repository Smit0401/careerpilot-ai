const { getArticles } = require("../services/article.service");

async function getArticlesController(req, res) {

    const topic = req.query.topic;

    if (!topic) {
        return res.status(400).json({
            message: "Topic is required"
        });
    }

    try {

        const articles = await getArticles(topic);

        res.status(200).json({
            articles
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch articles"
        });

    }

}

module.exports = {
    getArticlesController
};