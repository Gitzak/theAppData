function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login')
    }
    next()
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard')
    }
    next()
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
};
