const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware')
const setCurrentUrl = require('../middlewares/routeMiddleware');

router.get('/', (req, res) => {
    res.render('welcome', { layout: false });
});

router.get('/dashboard', ensureAuthenticated, setCurrentUrl, (req, res) => res.render('app/dashboard', {
    userName: req.user.userName
}));

module.exports = router;