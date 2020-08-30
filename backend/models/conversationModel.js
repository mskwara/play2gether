const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    recentActivity: {
        type: Date
    },
    group: Boolean
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// conversationSchema.virtual('messages', {
//     ref: 'Message',
//     foreignField: 'conversation',
//     localField: '_id'
// });

conversationSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'participants',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations'
    });

    next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;