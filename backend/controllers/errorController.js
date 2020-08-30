const AppError = require('../utils/appError')

function handleJWTExpiredError() {
    return new AppError('Your token has expired! Please log in again.', 401);
}

function handleJWTError() {
    return new AppError('Invalid token. Please log in again.', 401);
}

function handleCastErrorDB(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
    const key = Object.getOwnPropertyNames(err.keyValue)[0];
    const message = `Duplicate field value: ${err.keyValue[key]}. Please use another one!`;
    return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
    const errors = Object.getOwnPropertyNames(err.errors).map(el => err.errors[el].message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        name: err.name,
        message: err.message,
        stack: err.stack
    });
}

function sendErrorProduction(err, res) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log('Unexpected error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
}

function handleErrors(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error;
        // An ID in invalid format was given
        if (err.name === 'CastError')
            error = handleCastErrorDB(err);

        // An attempt to create user with duplicate email
        if (err.code === 11000)
            error = handleDuplicateFieldsDB(err);

        // Validation error
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(err);

        // Token validation error
        if (err.name === 'JsonWebTokenError')
            error = handleJWTError();

        // Token expired
        if (err.name === 'TokenExpiredError');
        error = handleJWTExpiredError();

        if (error)
            sendErrorProduction(error, res);
        else
            sendErrorProduction(err, res);
    }
}

module.exports = handleErrors;