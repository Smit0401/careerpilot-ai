const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

// async function authUser(req, res, next) {
//     const bearerToken = req.headers.authorization?.startsWith('Bearer ')
//         ? req.headers.authorization.slice(7)
//         : null
//     const token = req.cookies.token || bearerToken
    
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized" })
//     }

//     try {
//         const isTokenBlacklisted = await tokenBlacklistModel.exists({ token })
//         if (isTokenBlacklisted) {
//             return res.status(401).json({ message: "Session has expired" })
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decoded
//         req.token = token
//         next()
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized" })
//     }
// }
async function authUser(req, res, next) {

    console.log("Cookies received:", req.cookies)

    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null

    const token = req.cookies.token || bearerToken

    console.log("Token exists:", !!token)

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        console.log("Decoded token:", decoded)

        req.user = decoded
        req.token = token

        next()

    } catch (error) {

        console.log("JWT verification failed:", error.message)

        return res.status(401).json({ message: "Unauthorized" })
    }
}
module.exports = {
    authUser
}
