const path = require('path');
const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const gameRouter = require('./routes/gameRouter');
const conversationRouter = require('./routes/conversationRouter');
const commentRouter = require('./routes/commentRouter');
const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(express.json({ limit: '10kb' }));
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

app.all('*', (req, res, next) => {
    // next(new AppError(`Can't find ${req.originalUrl}`, 404));
    res.sendFile(path.join(__dirname, '/../fronend/build/index.html'));
});

app.use(globalErrorhandler);

module.exports = app;
