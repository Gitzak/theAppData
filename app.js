const express = require('express');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path = require('path');
const flash = require('connect-flash')
const passport = require('passport');
const bcrypt = require('bcrypt');
var oldInput = require('old-input');
require('dotenv').config();

const User = require('./server/models/User');

const secretKey = process.env.SECRET_KEY;

const port = process.env.PORT || 8500;

const app = express();

const oneDay = 1000 * 60 * 60 * 24;

require('./server/config/passport-local')(passport);

const connectDB = require('./server/config/db');

connectDB();

// Middlewares
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { path: '/', httpOnly: true, secure: false, maxAge: oneDay }
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(oldInput);

//------------ Global variables ------------//
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.validationErrors = req.flash('validationErrors');
    res.locals.error = req.flash('error');
    next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(expressLayout);
app.set('layout', './layouts/main_app');
app.set('views', path.join(__dirname, './views'));

// // Include the root route
// const rootRoutes = require('./routes/rootRoutes');
// app.use('/', rootRoutes);

// // Include authentication routes from the "auth" folder
app.use('/', require('./server/routes/appRoutes'));
app.use('/auth', require('./server/routes/authRoutes'));
app.use('/', require('./server/routes/usersRoutes'));

// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    // openInBrowser(`http://localhost:${port}`);
});

// function openInBrowser(url) {
//     const openCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
//     require('child_process').exec(`${openCommand} ${url}`);
// }