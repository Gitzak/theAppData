const express = require('express');
const usersRouters = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware')
const setCurrentUrl = require('../middlewares/routeMiddleware');
const { validateUserForm, handleValidationErrors } = require('../middlewares/userValidationsMiddleware');
const configureStorage = require('../middlewares/multerMiddleware');

const userController = require('../controllers/userController')

const destinationPath = './../../public/img/users';
const upload = configureStorage(destinationPath);

// ensureAuthenticated,
usersRouters.get('/users', setCurrentUrl, (req, res) => res.render('app/users/index'));

usersRouters.get('/users/create', setCurrentUrl, userController.addUser);

usersRouters.post('/users/create', setCurrentUrl, upload.single('inputImage'), validateUserForm, handleValidationErrors, userController.storeUser);

usersRouters.post('/users/list_users', setCurrentUrl, userController.listOfUsers)

usersRouters.get('/users/edit/:id', setCurrentUrl, userController.editUser)

usersRouters.put('/users/edit/:id', setCurrentUrl, upload.single('inputImage'), validateUserForm, handleValidationErrors, userController.updateUser)

module.exports = usersRouters;