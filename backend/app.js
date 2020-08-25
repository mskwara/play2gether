const express = require('express');
const userRouter = require('./routes/userRouter');

const app = express();

app.use(cors());
app.options("*", cors());

app.use('/', userRouter)

module.exports = app;