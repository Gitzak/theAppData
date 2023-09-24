// Import necessary libraries for file uploading
const multer = require('multer');
const path = require('path');

// Configure storage settings for uploaded files
const configureStorage = (destinationPath) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, destinationPath));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
    });

    return multer({ storage: storage });
};

// Export the multer instance for use in route handlers
module.exports = configureStorage;
