const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conx = await mongoose.connect(process.env.MONGODB_URI);
        console.log('connect db : ' + conx.connection.host);
    } catch (error) {
        console.log('Error : ' + error);
    }
}

module.exports = connectDB;