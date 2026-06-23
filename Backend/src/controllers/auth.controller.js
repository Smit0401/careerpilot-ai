const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production'
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    }
}

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email
    }
}

function validateCredentials({ username, email, password }, requireUsername = false) {
    if (requireUsername && (!username || username.trim().length < 2)) {
        return 'Username must be at least 2 characters'
    }
    if (!email || !EMAIL_PATTERN.test(email.trim())) {
        return 'Enter a valid email address'
    }
    if (!password || password.length < 8) {
        return 'Password must be at least 8 characters'
    }
    return null
}

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body
    const validationError = validateCredentials({ username, email, password }, true)
    if (validationError) {
        return res.status(400).json({ message: validationError })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }] 
    })

    if(isUserAlreadyExists) {
        return res.status(400).json({ message: "Username or email already exists" })
    }
    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hash
    })
    const token = jwt.sign(
        {id : user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
    res.cookie('token', token, cookieOptions())
    res.status(201).json({ message: "User registered successfully", 
        user: publicUser(user)
    })
    

}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body
    const validationError = validateCredentials({ email, password })
    if (validationError) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user = await userModel.findOne({ email: email.trim().toLowerCase() }).select('+password')

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, cookieOptions())
    res.status(200).json({
        message: "Login successful",
        user: publicUser(user)
    })
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.token || req.cookies.token

    if (token) {
        const decoded = jwt.decode(token)
        const expiresAt = decoded?.exp
            ? new Date(decoded.exp * 1000)
            : new Date(Date.now() + 24 * 60 * 60 * 1000)
        await tokenBlacklistModel.updateOne(
            { token },
            { $setOnInsert: { token, expiresAt } },
            { upsert: true }
        )
    }

    res.clearCookie("token", { ...cookieOptions(), maxAge: undefined })

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(401).json({ message: 'User no longer exists' })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: publicUser(user)
    })

}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
