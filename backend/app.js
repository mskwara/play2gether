const express = require('express');
const userRouter = require('./routes/userRouter');

const app = express();

app.use('/', userRouter)

module.exports = app;