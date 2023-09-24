function setCurrentUrl(req, res, next) {
    res.locals.currentUrl = req.url;
    next();
}

module.exports = setCurrentUrl;