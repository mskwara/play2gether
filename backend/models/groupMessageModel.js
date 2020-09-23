const mongoose = require('mongoose');
const GroupConv = require('./groupConversationModel');
const User = require('./userModel');

const groupMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.ObjectId,
        ref: 'GroupConversation',
        required: [true, 'Message must have a recipient']
    },
    from: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Message must have a sender']
    },
    sentAt: {
        type: Date,
        required: [true, 'Message must have a timestamp']
    },
    message: {
        type: String,
        required: [true, 'Empty messages are not allowed']
    }
});

groupMessageSchema.pre(/^find/, function (next) {
    this.select('-__v');

    next();
});

groupMessageSchema.post('save', async function (Message) {
    const conv = await GroupConv.findByIdAndUpdate(Message.conversation, {
        recentActivity: Message.sentAt
    });
    await User.updateMany({
        _id: { $in: conv.participants }
    }, {
        $addToSet: { updatedGroupConversations: conv._id }
    });
});

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);

module.exports = GroupMessage;