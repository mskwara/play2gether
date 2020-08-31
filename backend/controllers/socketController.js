const { checkToken } = require('./authController');
const Message = require('./../models/messageModel');

function join(socket) {
    return async data => {
        const user = await checkToken(data.jwt);

        if (user && user.conversations.includes(data.room)) {
            socket.join(data.room);
            if (process.env.NODE_ENV === 'development')
                console.log(`User ${user.id} succesfully connected to chat room no. ${data.room}.`);
        } else if (process.env.NODE_ENV === 'development') {
            console.log(`Connection failed`);
        }
    }
}

function leave(socket) {
    return async data => {
        const user = await checkToken(data.jwt);

        if (user && user.conversations.includes(data.room)) {
            socket.leave(data.room);
            if (process.env.NODE_ENV === 'development')
                console.log(`User ${user.id} succesfully disconnected from chat room no. ${data.room}.`);
        } else if (process.env.NODE_ENV === 'development') {
            console.log(`Disconnection failed`);
        }
    }
}

function send(io) {
    return async data => {
        const user = await checkToken(data.jwt);

        if (user && user.conversations.includes(data.room)) {
            await Message.create({
                conversation: data.room,
                from: user.id,
                sentAt: Date.now(),
                message: data.message
            });
            data.name = user.name;
            io.sockets.in(data.room).emit('chat', data);
            if (process.env.NODE_ENV === 'development') {
                console.log(`User ${user.id} succesfully sent message to chat room no. ${data.room}.`);
                console.log(data);
            }
        } else if (process.env.NODE_ENV === 'development') {
            console.log('Error while sending message');
        }
    }
};

exports.handleEvents = io => {
    io.on('connection', socket => {
        // Logging
        if (process.env.NODE_ENV === 'development')
            console.log('Socket connection established. Socket:', socket.id);
        // Handle chat events
        socket.on('join', join(socket));
        socket.on('leave', leave(socket));
        socket.on('send', send(io));
    });
}