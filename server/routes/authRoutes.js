const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../middlewares/authMiddleware')

const authController = require('../controllers/authController')

// Login Route
router.get('/login', forwardAuthenticated, (req, res) => res.render('auth/login', { layout: "layouts/main_auth" }));

// Login POST Handle
router.post('/login', forwardAuthenticated, authController.loginHandle);

// Logout GET Handle
router.get('/logout', authController.logoutHandle);

// // Forgot Password Route
// router.get('/forgot', forwardAuthenticated, (req, res) => res.render('forgot'));

// // Reset Password Route
// router.get('/reset/:id', forwardAuthenticated, (req, res) => {
//     // console.log(id)
//     res.render('reset', { id: req.params.id })
// });

// // Register Route
// router.get('/register', (req, res) => res.render('register'));

// // Register POST Handle
// router.post('/register', authController.registerHandle);

// // Email ACTIVATE Handle
// router.get('/activate/:token', forwardAuthenticated, authController.activateHandle);

// // Forgot Password Handle
// router.post('/forgot', authController.forgotPassword);

// // Reset Password Handle
// router.post('/reset/:id', forwardAuthenticated, authController.resetPassword);

// // Reset Password Handle
// router.get('/forgot/:token', forwardAuthenticated, authController.gotoReset);

module.exports = router;