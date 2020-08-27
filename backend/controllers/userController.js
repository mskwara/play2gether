const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = factory.getAll(User, '');

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    });
});