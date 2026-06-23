const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const multer = require('multer')
const app = express()

const allowedOrigins = new Set([
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
].filter(Boolean))

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Origin is not allowed by CORS'))
    },
    credentials: true
}))

const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const learningRouter = require('./routes/learning.routes')
const articleRouter = require('./routes/article.routes')
const selfStudyRouter = require('./routes/selfStudy.routes')

app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)
app.use('/api/learning', learningRouter)
app.use('/api/articles', articleRouter)
app.use('/api/self-study', selfStudyRouter)

app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

app.use((error, _req, res, _next) => {
    if (error instanceof multer.MulterError) {
        const message = error.code === 'LIMIT_FILE_SIZE'
            ? 'Resume must be 5MB or smaller'
            : error.message
        return res.status(400).json({ message })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message })
    }

    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid identifier' })
    }

    if (error.code === 11000) {
        return res.status(409).json({ message: 'Username or email already exists' })
    }

    const status = error.status || 500
    if (status >= 500) {
        console.error(error)
    }

    return res.status(status).json({
        message: status >= 500 ? 'Something went wrong. Please try again.' : error.message
    })
})

module.exports = app
