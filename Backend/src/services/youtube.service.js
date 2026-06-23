const axios = require("axios")
const { getYoutubeQuery } = require("../utils/youtubeQuery.utils")
const { trustedChannels } = require("../utils/trustedChannels")
const { redisClient } = require("./redis.service")

async function getYoutubeVideos(topic) {

    const cacheKey = `videos:${topic.toLowerCase()}`

    const cachedVideos = await redisClient.get(cacheKey)

    if (cachedVideos) {

        console.log("Video cache hit")

        return JSON.parse(cachedVideos)

    }

    console.log("Video cache miss")
    const { query, domain } = getYoutubeQuery(topic)

    const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
            params: {
                key: process.env.YOUTUBE_API_KEY,
                q: query,
                part: "snippet",
                maxResults: 10,
                type: "video"
            }
        }
    )

    const trusted = trustedChannels[domain] || [];

// Remove shorts and low-quality videos
    const filteredVideos = response.data.items.filter(video => {

        const title = video.snippet.title.toLowerCase();

        return (
            !title.includes("#shorts") &&
            !title.includes("shorts") &&
            !title.includes("1 min") &&
            !title.includes("2 min")
        );

    });

    // Pick videos from trusted channels
    const trustedVideos = filteredVideos.filter(video => {

        const channel = video.snippet.channelTitle;

        return trusted.some(
            trustedChannel =>
                channel.toLowerCase()
                    .includes(trustedChannel.toLowerCase())
        );

    });

    // Use trusted videos if possible, otherwise fallback
    const selectedVideos =
        trustedVideos.length >= 3
            ? trustedVideos
            : filteredVideos;

    const videos = selectedVideos
        .slice(0, 3)
        .map(video => ({
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
            channel: video.snippet.channelTitle,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`
        }));

    await redisClient.set(
        cacheKey,
        JSON.stringify(videos),
        {
            EX: 60 * 60 * 24 * 7
        }
    )

    return videos
}

module.exports = {
    getYoutubeVideos
}