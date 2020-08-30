const path = require("path");
const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const gameRouter = require("./routes/gameRouter");
const conversationRouter = require('./routes/conversationRouter');
const AppError = require("./utils/appError");
const globalErrorhandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();

// app.use(cors());
// app.options("*", cors());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "static")));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Testowy pajac
app.get("/", (req, res, next) => {
    // const cookieOptions = {
    //     expires: new Date(Date.now() + 60 * 1000 * 60 * 60 * 24),
    //     httpOnly: true,
    // };

    // res.cookie("debil", "rafal", cookieOptions);

    res.status(200).json({
        status: "success",
        message: "rafal to pajac",
    });
});

app.use("/users", userRouter);
app.use("/games", gameRouter);
app.use('/conversations', conversationRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
