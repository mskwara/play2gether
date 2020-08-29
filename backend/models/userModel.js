const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'You need to specify your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    password: {
        type: String,
        required: [true, 'Please specify your password'],
        minlegth: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    photo: {
        type: String,
        default: 'defaultUser.jpeg'
    },
    friends: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    deletedFriends: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        select: false
    }],
    receivedFriendRequests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    pendingFriendRequests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    conversations: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Conversation'
    }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (providedPassword, hashedPassword) {
    return await bcrypt.compare(providedPassword, hashedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;