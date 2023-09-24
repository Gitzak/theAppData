const express = require('express');
const usersRouters = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware')
const setCurrentUrl = require('../middlewares/routeMiddleware');
const { validateUserForm, handleValidationErrors } = require('../middlewares/userValidationsMiddleware');
const configureStorage = require('../middlewares/multerMiddleware');

const userController = require('../controllers/userController')

const destinationPath = './../../public/img/users';
const upload = configureStorage(destinationPath);

usersRouters.get('/users', ensureAuthenticated, setCurrentUrl, (req, res) => res.render('app/users/index', {
    userName: req.user.userName
}));

usersRouters.get('/users/add', setCurrentUrl, userController.addUser);


usersRouters.post('/users/store', setCurrentUrl, upload.single('inputImage'), validateUserForm, handleValidationErrors, userController.storeUser);

module.exports = usersRouters;