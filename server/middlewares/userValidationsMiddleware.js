const { body, validationResult } = require('express-validator');

exports.validateUserForm = [
    body('inputUsername', 'Username is required').notEmpty(),
    body('inputEmail', 'Invalid email').isEmail(),
    body('inputLastName', 'Last name is required').notEmpty(),
    body('inputFirstName', 'First name is required').notEmpty(),
    body('inputSalary').isNumeric().withMessage('Salary must be a number'),
    body('inputType').isIn(['Admin', 'Salary']).withMessage('Invalid user type'),
    body('inputState').isIn(['active', 'inactive']).withMessage('Invalid user state'),
    body('inputVerified').isBoolean().withMessage('Verification must be a boolean'),
    body('inputImage')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            const allowedExtensions = ['jpg', 'jpeg', 'png'];
            const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('Invalid image format. Use jpg, jpeg, or png.');
            }
            return true;
        }),
];

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.locals.validationErrors = errors.array();
        return next();
    }

    next();
};
