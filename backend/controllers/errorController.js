function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        name: err.name,
        message: err.message,
        stack: err.stack
    });
}

function handleErrors(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        // To be implemented
    }
}

module.exports = handleErrors;