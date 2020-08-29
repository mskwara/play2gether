const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');
const User = require('./models/userModel');
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Message = require('./models/messageModel');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('DB connection established!')
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

const io = socket(server, {});

async function checkToken(token) {
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log(err);
        return false;
    }

    // 3) Check if user still exists
    if (decoded) {
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return false;
        }

        // 4) Check if user changed password after token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return false;
        }

        return currentUser;
    }
    return false;
}


io.on('connection', socket => {
    console.log('Socket connection established. Socket:', socket.id);
    // Handle chat event
    socket.on('subscribe', async (data) => {
        let user;
        try {
            user = await checkToken(data.jwt);
        } catch (err) {
            console.log(err);
        }

        if (user && user.conversations.includes(data.room)) {
            console.log('joining room', data.room);
            socket.join(data.room);
        } else {
            console.log('hehe, ale nie');
        }
    });
    socket.on('send', async (data) => {
        let user;
        try {
            user = await checkToken(data.jwt);
        } catch (err) {
            console.log(err);
        }

        if (user && user.conversations.includes(data.room)) {
            await Message.create({
                conversation: data.room,
                from: user.id,
                sentAt: Date.now(),
                message: data.message
            });
            console.log(data);
            io.sockets.in(data.room).emit('chat', data);
        } else {
            console.log('hehe, ale nie');
        }

    });
});