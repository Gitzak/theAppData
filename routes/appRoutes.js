// Import necessary libraries and modules
const express = require('express');
const { check } = require('express-validator');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create an Express Router for admin routes
const appRoutes = express.Router();

appRoutes.get('/', authMiddleware.checkAuthenticated, dashboardController.renderDashboard);

// Export the adminRouter for use in the application
module.exports = appRoutes;
