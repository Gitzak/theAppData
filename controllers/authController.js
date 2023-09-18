const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcrypt');
const passport = require('passport');
const secretKey = process.env.SECRET_KEY;

const urlUsers = 'http://localhost:3000/users'

async function findUserByEmail(email) {
    const response = await axios.get(urlUsers);
    const users = response.data;
    return users.find(user => user.email === email);
}

function renderRegisterPage(req, res) {
    const locals = {
        title: "Create an Account!",
    };
    res.render('auth/register', { errors: [], message: '', layout: 'layouts/main_auth', locals: locals });
}

function renderLoginPage(req, res) {
    const locals = {
        title: "Login",
    };
    res.render('auth/login', { errors: [], message: '', layout: 'layouts/main_auth', locals: locals });
}

function logout(req, res) {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
}

function processLogin(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/auth/login",
        failureFlash: true,
    })
}

module.exports = {
    renderRegisterPage,
    renderLoginPage,
    processLogin
};
