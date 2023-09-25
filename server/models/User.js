const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables-fix')

const Schema = mongoose.Schema;

const userRoles = ['Admin', 'Salary'];
const userStates = ['active', 'inactive'];


const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: null,
    },
    salary: {
        type: Number,
        min: 0,
        default: 0,
    },
    type: {
        type: String,
        enum: userRoles,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    state: {
        type: String,
        enum: userStates,
        required: true,
    },
    resetLink: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

UserSchema.plugin(dataTables, {
    formatters: {
        toPublic: function (user) {
            return {
                id: user._id,
                userName: user.userName,
                fullName: user.firstName + ' ' + user.lastName,
                email: user.email,
                salary: user.salary,
                type: user.type,
                verified: user.verified,
                state: user.state,
                profileImage: user.profileImage ? user.profileImage : 'no-image.jpg',
                createdAt: user.createdAt.toLocaleDateString()
            }
        }
    }
});

module.exports = mongoose.model('User', UserSchema);
