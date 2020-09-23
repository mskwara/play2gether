const { checkToken } = require('./authController');
const PrivateConversation = require('./../models/privateConversationModel');
const GroupConversation = require('./../models/groupConversationModel');
const PrivateMessage = require('./../models/privateMessageModel');
const GroupMessage = require('./../models/groupMessageModel');
const User = require('./../models/userModel');

async function removeNotification(user, private, room) {
    if (private) {
        await User.findByIdAndUpdate(user._id, {
            $pull: {
                updatedPrivateConversations: room
            }
        });
    } else {
        await User.findByIdAndUpdate(user._id, {
            $pull: {
                updatedGroupConversations: room
            }
        });
    }
}

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
        console.log(data.room, convs[0]);
        if (user && convs.includes(data.room)) {
            socket.join(data.room + suffix);
            await removeNotification(user, data.private, data.room);
            if (process.env.NODE_ENV === 'development')
                console.log(`User ${user._id} succesfully connected to chat room no. ${data.room}.`);
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
            await removeNotification(user, data.private, data.room);
            if (process.env.NODE_ENV === 'development')
                console.log(`User ${user._id} succesfully disconnected from chat room no. ${data.room}.`);
        } else if (process.env.NODE_ENV === 'development') {
            console.log(`Disconnection failed`);
        }
    }
}

function send(io) {
    return async data => {
        const user = await checkToken(data.jwt);

        let convs, suffix, Model;
        timestamp = Date.now();
        if (data.private) {
            convs = user.privateConversations;
            suffix = 'p';
            Model = PrivateMessage;
        } else {
            convs = user.groupConversations;
            suffix = 'g';
            Model = GroupMessage;
        }

        if (user && convs.includes(data.room) && data.message !== '') {
            messageOBJ = {
                conversation: data.room,
                from: user._id,
                sentAt: timestamp,
                message: data.message
            };

            const message = await Model.create(messageOBJ);
            messageOBJ.name = user.name;
            messageOBJ.photo = user.photo;
            messageOBJ._id = message._id;
            messageOBJ.sentAt = message.sentAt;

            io.sockets.in(data.room + suffix).emit('chat', messageOBJ);
            await message.updateUsersAndConv();

            if (process.env.NODE_ENV === 'development') {
                console.log(`User ${user._id} succesfully sent message to chat room no. ${data.room}.`);
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