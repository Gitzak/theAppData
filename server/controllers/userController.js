const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const User = require('../models/User');

exports.listOfUsers = (req, res) => {
    // console.log(typeof req.body.search.value);
    User.dataTables({
        limit: req.body.length,
        skip: req.body.start,
        columns: req.body.columns,
        order: req.body.order,
        sort: {
            createdAt: -1
        },
        search: {
            value: req.body.search.value,
            fields: ['userName', 'email', 'firstName', 'lastName', 'type', 'state']
        },
        formatter: 'toPublic',
    }).then(function (table) {
        res.json({
            data: table.data,
            recordsFiltered: table.total,
            recordsTotal: table.total
        });
    }).catch(function (err) {
        console.log(err);
    });
}

exports.addUser = (req, res) => {
    res.status(200).render('app/users/create', {
        // userName: req.user.userName,
        oldInput: []
    })
}

exports.storeUser = async (req, res) => {
    const validationErrors = res.locals.validationErrors;
    console.log(validationErrors);
    if (validationErrors.length > 0) {
        req.flash('validationErrors', validationErrors);
        return res.status(500).render('app/users/create', {
            // userName: req.user.userName,
            oldInput: req.body
        })
    }

    try {

        const randomPassword = generateRandomPassword(14);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

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

        req.flash(
            'success_msg',
            'New user created successfully!'
        );

        return res.redirect('/users');
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while saving the user.');
    }
}

exports.editUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
            .lean();

        if (user) {
            res.status(200).render("app/users/edit", {
                userID: req.params.id,
                user
            });
        }

    } catch (error) {
        res.send("Something went wrong.");
    }
}

exports.updateUser = async (req, res) => {

    const user = await User.findById({ _id: req.params.id }).lean();

    try {
        const updatedData = {
            userName: req.body.inputUsername,
            email: req.body.inputEmail,
            firstName: req.body.inputFirstName,
            lastName: req.body.inputLastName,
            salary: req.body.inputSalary,
            type: req.body.inputType,
            state: req.body.inputState,
            verified: req.body.inputVerified,
            updatedAt: Date.now()
        };

        const profileImage = req.file;

        if (profileImage !== undefined) {
            fs.access(path.join(__dirname, './../public/img/users/') + user.profileImage, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(path.join(__dirname, './../public/img/users/') + user.profileImage, (unlinkErr) => {
                        if (unlinkErr) {
                            req.flash('danger', 'An error has occurred please try again later');
                            return res.redirect(`/users/edit/${req.params.id}`);
                        }
                    });
                }
            });
        }

        updatedData.profileImage = profileImage ? profileImage.filename : user.profileImage;

        await User.findOneAndUpdate(
            { _id: req.params.id },
            updatedData
        );

        req.flash('success_msg', 'User Updated Successfully');
        res.redirect("/users/edit/" + req.params.id);
    } catch (error) {
        console.log(error);
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