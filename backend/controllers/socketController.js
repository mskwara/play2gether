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
            messageOBJ = {
                conversation: data.room,
                from: user.id,
                sentAt: Date.now(),
                message: data.message
            };
            const message = await Message.create(messageOBJ);
            messageOBJ.name = user.name;
            messageOBJ.photo = user.photo;
            messageOBJ._id = message._id;
            io.sockets.in(data.room).emit('chat', messageOBJ);
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