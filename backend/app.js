const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const gameRouter = require("./routes/gameRouter");
const AppError = require("./utils/appError");
const globalErrorhandler = require("./controllers/errorController");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Testowy pajac
app.get("/", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "rafal to pajac",
    });
});

app.use("/users", userRouter);
app.use("/games", gameRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
