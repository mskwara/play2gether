const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const userRouter = require('./routes/userRouter');
const gameRouter = require('./routes/gameRouter');
const conversationRouter = require('./routes/conversationRouter');
const commentRouter = require('./routes/commentRouter');
const globalErrorhandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit requests per IP
app.use('/api', rateLimit({
    max: 100,
    windowMS: 60 * 1000,
    message: 'Too many requests from this IP, please try again later!'
}));

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(cookieParser());

// Body parser, reads data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Testowy pajac
// app.get('/', (req, res, next) => {
//     // const cookieOptions = {
//     //     expires: new Date(Date.now() + 60 * 1000 * 60 * 60 * 24),
//     //     httpOnly: true,
//     // };

//     // res.cookie('debil', 'rafal', cookieOptions);

//     res.status(200).json({
//         status: 'success',
//         message: 'rafal to pajac',
//     });
// });


app.use('/api/users', userRouter);
app.use('/api/games', gameRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/comments', commentRouter);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Redirect other requests to frontend
app.all('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../frontend/build/index.html'));
});

app.use(globalErrorhandler);

module.exports = app;
