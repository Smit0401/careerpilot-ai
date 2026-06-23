const express = require('express');
const authController = require('../controllers/auth.controller')
const authRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

authRouter.post('/login', authController.loginUserController);

/** * @route GET /api/auth/logout
 * @desc Logout a user, Clear the token cookie and add the token to blacklist
 * @access Public
 */

authRouter.post('/logout', authMiddleware.authUser, authController.logoutUserController);
authRouter.get('/logout', authMiddleware.authUser, authController.logoutUserController);

/**
 * @route GET/api/auth/get-me
 * @desc Get the logged in user's details, expects token in the cookie
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController)
module.exports = authRouter;
