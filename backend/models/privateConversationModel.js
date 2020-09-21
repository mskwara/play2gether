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
    }
});

privateConversationSchema.post('save', function (err, doc, next) {
    this.__v = undefined;
    next();
});

privateConversationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers'
    }).populate({
        path: 'correspondent',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers'
    }).select('-__v');

    next();
});

const PrivateConversation = mongoose.model('PrivateConversation', privateConversationSchema);

module.exports = PrivateConversation;