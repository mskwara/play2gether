const mongoose = require('mongoose');

const privateConversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    correspondent: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true
    },
    recentActivity: {
        type: Date
    }
});

privateConversationSchema.pre(/^find/,  function (next) {
    this.populate({
        path: 'user',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email -games -privateConversations -groupConversations'
    }).populate({
        path: 'correspondent',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email -games -privateConversations -groupConversations'
    });

    next();
});

const PrivateConversation = mongoose.model('PrivateConversation', privateConversationSchema);

module.exports = PrivateConversation;