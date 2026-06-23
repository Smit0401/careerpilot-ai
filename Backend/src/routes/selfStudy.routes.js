const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const {
    generateStudyPlanController
} = require("../controllers/selfStudy.controller")

const router = express.Router()

router.post(
    "/",
    authMiddleware.authUser,
    generateStudyPlanController
)

module.exports = router