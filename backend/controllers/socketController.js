const { checkToken } = require('./authController');
const PrivateMessage = require('./../models/privateMessageModel');
const GroupMessage = require('./../models/groupMessageModel');

function join(socket) {
    return async data => {
        const user = await checkToken(data.jwt);

        let convs, suffix;
        if (data.private) {
            convs = user.privateConversations;
            suffix = 'p';
        } else {
            convs = user.groupConversations;
            suffix = 'g';
        }

        if (user && convs.includes(data.room)) {
            socket.join(data.room + suffix);
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

        let convs, suffix;
        if (data.private) {
            convs = user.privateConversations;
            suffix = 'p';
        } else {
            convs = user.groupConversations;
            suffix = 'g';
        }

        if (user && convs.includes(data.room)) {
            socket.leave(data.room + suffix);
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

        let convs, suffix, Model;
        if (data.private) {
            convs = user.privateConversations;
            suffix = 'p';
            Model = PrivateMessage;
        } else {
            convs = user.privateConversations;
            suffix = 'g';
            Model = GroupMessage;
        }

        if (user && convs.includes(data.room)) {
            messageOBJ = {
                conversation: data.room,
                from: user.id,
                sentAt: Date.now(),
                message: data.message
            };
            const message = await Model.create(messageOBJ);
            messageOBJ.name = user.name;
            messageOBJ.photo = user.photo;
            messageOBJ._id = message._id;
            messageOBJ.sentAt = message.sentAt;
            io.sockets.in(data.room + suffix).emit('chat', messageOBJ);
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