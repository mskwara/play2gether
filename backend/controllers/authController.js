const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

function authToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

function createAuthToken(user, statusCode, res) {
    const token = authToken(user.id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 1000 * 60 * 60 * 24),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;
    
    user.password = undefined;
    
    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createAuthToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        
    }
});