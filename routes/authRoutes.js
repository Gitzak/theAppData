// Import necessary libraries and modules
const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create an Express Router for authentication routes
const authRouter = express.Router();

// Define routes for registration
authRouter.get('/register', authMiddleware.checkNotAuthenticated, authController.renderRegisterPage);

// Define routes for login
authRouter.get('/login', authMiddleware.checkNotAuthenticated, authController.renderLoginPage);

// authRouter.post('/login', authMiddleware.checkNotAuthenticated, authController.processLogin);

// Export the authRouter for use in the application
module.exports = authRouter;
