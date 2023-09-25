const express = require('express');
const usersRouters = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware')
const setCurrentUrl = require('../middlewares/routeMiddleware');
const { validateUserForm, handleValidationErrors } = require('../middlewares/userValidationsMiddleware');
const configureStorage = require('../middlewares/multerMiddleware');

const userController = require('../controllers/userController')

const destinationPath = './../../public/img/users';
const upload = configureStorage(destinationPath);

usersRouters.get('/users', ensureAuthenticated, setCurrentUrl, (req, res) => res.render('app/users/index', { userName: req.user.userName }));

usersRouters.get('/users/create', ensureAuthenticated, setCurrentUrl, userController.addUser);

usersRouters.post('/users/create', ensureAuthenticated, setCurrentUrl, upload.single('inputImage'), validateUserForm, handleValidationErrors, userController.storeUser);

usersRouters.post('/users/list_users', ensureAuthenticated, setCurrentUrl, userController.listOfUsers)

usersRouters.get('/users/edit/:id', ensureAuthenticated, setCurrentUrl, userController.editUser)

usersRouters.put('/users/edit/:id', ensureAuthenticated, setCurrentUrl, upload.single('inputImage'), validateUserForm, handleValidationErrors, userController.updateUser)

usersRouters.post('/users/delete/:id', ensureAuthenticated, setCurrentUrl, userController.deleteUser)

module.exports = usersRouters;

