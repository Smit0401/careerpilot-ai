const axios = require("axios");
const { redisClient } = require("./redis.service");
const priorityDomains = [
    "react.dev",
    "nodejs.org",
    "expressjs.com",
    "mongodb.com",
    "docs.python.org",
    "pytorch.org",
    "tensorflow.org",
    "docs.docker.com",
    "kubernetes.io",
    "docs.aws.amazon.com",
    "geeksforgeeks.org",
    "w3schools.com",
    "medium.com"
];

function getRank(url) {

    const index = priorityDomains.findIndex(domain =>
        url.includes(domain)
    );

    return index === -1 ? 100 : index;
}

async function getArticles(topic) {
    const cacheKey = `articles:${topic.toLowerCase()}`;

    const cachedArticles = await redisClient.get(cacheKey);

    if (cachedArticles) {

        console.log("Cache Hit");

        return JSON.parse(cachedArticles);

    }
    console.log("Cache Miss");

    const response = await axios.get(
        "https://serpapi.com/search.json",
        {
            params: {
                q: topic,
                api_key: process.env.SERP_API_KEY,
                num: 15
            }
        }
    );

    const results = response.data.organic_results || [];

    const filtered = results
        .filter(result => getRank(result.link) !== 100)
        .sort((a, b) => getRank(a.link) - getRank(b.link))
        .slice(0, 3)
        .map(result => ({
            title: result.title,
            source: result.source,
            url: result.link
        }));

    await redisClient.set(
        cacheKey,
        JSON.stringify(filtered),
        {
            EX: 60 * 60 * 24 * 7
        }
    );

    return filtered;
}

module.exports = {
    getArticles
};