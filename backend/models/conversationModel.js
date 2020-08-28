const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    recentActivity: {
        type: Date
    }
});

conversationSchema.virtual('messages', {
    ref: 'Message',
    foreignField: 'conversation',
    localField: '_id'
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;