const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const User = require('../models/User');

const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

exports.listOfUsers = async (req, res) => {
    const authenticatedUserId = req.user._id;
    User.dataTables({
        find: {
            _id: { $ne: authenticatedUserId },
            deletedAt: null
        },
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
        userName: req.user.userName,
        oldInput: []
    })
}

exports.storeUser = async (req, res) => {
    const validationErrors = res.locals.validationErrors;
    if (validationErrors.length > 0) {
        req.flash('validationErrors', validationErrors);
        return res.status(500).render('app/users/create', {
            userName: req.user.userName,
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

        const info = await transport.sendMail({
            from: 'noreply@user-manager.com',
            to: newUser.email,
            subject: "Welcome to User Manager",
            text: `Hello,\n\nWelcome to User Manager! We are thrilled to have you as a member of our platform. Here are your login credentials:\n\nUsername: ${newUser.userName}\nPassword: ${randomPassword}\n\nPlease keep these credentials secure and do not share them with anyone. You can use them to access your account and enjoy our services.\n\nIf you have any questions or need assistance, feel free to contact our support team at support@user-manager.com.\n\nThank you for choosing User Manager!\n\nBest regards,\nThe User Manager Team\n`,
            html: `<p>Hello,</p><p>Welcome to User Manager! We are thrilled to have you as a member of our platform. Here are your login credentials:</p><ul><li><strong>Username:</strong> ${newUser.userName}</li><li><strong>Password:</strong> ${randomPassword}</li></ul><p>Please keep these credentials secure and do not share them with anyone. You can use them to access your account and enjoy our services.</p><p>If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:support@user-manager.com">support@user-manager.com</a>.</p><p>Thank you for choosing User Manager</p><p>Best regards,<br>The User Manager Team</p>`,
        });

        console.log("Message sent: %s", info.messageId);

        req.flash(
            'success_msg',
            'New user created successfully!'
        );

        return res.redirect('/users');
    } catch (error) {
        console.error(error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
            req.flash('error_msg', 'Email address is already in use. Please use a different email address.');
        } else {
            req.flash('error_msg', 'An error occurred while processing your request.');
        }

        return res.redirect('/users/create');
    }
}

exports.editUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
            .lean();

        if (user) {
            res.status(200).render("app/users/edit", {
                userName: req.user.userName,
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

exports.deleteUser = async (req, res) => {
    try {
        const updateResult = await User.updateOne(
            { _id: req.params.id },
            { $set: { deletedAt: Date.now() } }
        );

        if (updateResult.modifiedCount === 1) {
            return res.sendStatus(200)
        } else {
            return res.sendStatus(404)
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(500)
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