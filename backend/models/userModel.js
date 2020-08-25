const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'You need to specify your email!'],
        unique: true,
        lowercase: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;