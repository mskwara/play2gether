const mongoose = require('mongoose');

const groupConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    name: {
        type: String
    }
});

groupConversationSchema.post('save', function (err, doc, next) {
    this.__v = undefined;
    next();
});

groupConversationSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'participants',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations'
    }).select('-__v');

    next();
});

const GroupConversation = mongoose.model('GroupConversation', groupConversationSchema);

module.exports = GroupConversation;