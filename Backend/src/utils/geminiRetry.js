async function generateWithRetry(ai, request, maxRetries = 3) {

    let delay = 1000

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            return await ai.models.generateContent(request)

        } catch (error) {

            const status = error.status || error.code

            const shouldRetry =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504;

            if (!shouldRetry || attempt === maxRetries) {
                throw error
            }

            console.log(
                `Gemini unavailable. Retry ${attempt}/${maxRetries} in ${delay}ms`
            )

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            )

            delay *= 2

        }

    }

}

module.exports = {
    generateWithRetry
}