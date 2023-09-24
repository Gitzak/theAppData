const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const User = require('../models/User');

let temporaryOldInput = {};

exports.addUser = (req, res) => {
    res.render('app/users/create', {
        // userName: req.user.userName,
        oldInput: temporaryOldInput
    })
}

exports.storeUser = async (req, res) => {
    const validationErrors = res.locals.validationErrors;
    console.log(validationErrors);
    if (validationErrors.length > 0) {
        temporaryOldInput = req.body;
        req.flash('validationErrors', validationErrors);
        return res.redirect('/users/add');
    }

    try {

        const randomPassword = generateRandomPassword(14);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        console.log(randomPassword);

        const profileImage = req.file;

        const newUser = new User({
            userName: req.body.inputUsername,
            email: req.body.inputEmail,
            password: hashedPassword,
            firstName: req.body.inputFirstName,
            lastName: req.body.inputLastName,
            profileImage: profileImage ? profileImage.filename : null,
            salary: req.body.inputSalary,
            type: req.body.inputType,
            state: req.body.inputState,
            verified: req.body.inputVerified,
        });

        await newUser.save();

        return res.redirect('/users');
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while saving the user.');
    }
}

function generateRandomPassword(length = 12) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}