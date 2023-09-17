const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const axios = require('axios');

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

module.exports = {
    renderRegisterPage,
    renderLoginPage,
    // processLogin
};
