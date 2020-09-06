const mongoose = require('mongoose');

const groupConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    recentActivity: {
        type: Date
    },
});

groupConversationSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'participants',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email'
    });

    next();
});

const GroupConversation = mongoose.model('GroupConversation', groupConversationSchema);

module.exports = GroupConversation;