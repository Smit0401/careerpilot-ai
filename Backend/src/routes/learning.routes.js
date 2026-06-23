const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const learningController = require("../controllers/learning.controller")

const learningRouter = express.Router()

/**
 * @route GET /api/learning
 * @desc Get learning resources for a topic
 * @access Private
 */

learningRouter.get(
    "/",
    authMiddleware.authUser,
    learningController.getLearningResources
)

module.exports = learningRouter