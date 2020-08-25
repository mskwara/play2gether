const express = require('express');
const userRouter = require('./routes/userRouter');
const gameRouter = require('./routes/gameRouter');
const cors = require('cors');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Testowy pajac
app.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'rafal to pajac'
    });
})

app.use('/users', userRouter);
app.use('/games', gameRouter);

module.exports = app;
