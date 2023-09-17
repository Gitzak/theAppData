async function renderDashboard(req, res) {
    const locals = {
        titlePage: "Dashboard",
    };
    try {
        res.render('app/dashboard', { locals });
    } catch (error) {
        res.status(500).render('errors/error', {
            type: 500,
            message: 'Internal Server Error',
            text: 'An internal server error occurred.',
            layout: false
        });
    }
}

module.exports = {
    renderDashboard,
};
