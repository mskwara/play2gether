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

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;