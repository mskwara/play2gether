const mongoose = require('mongoose');
const PrivateConv = require('./privateConversationModel');
const User = require('./userModel');

const privateMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.ObjectId,
        ref: 'PrivateConversation',
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

privateMessageSchema.pre(/^find/, function (next) {
    this.select('-__v');

    next();
});

privateMessageSchema.methods.updateUsersAndConv = async function () {
    conv = await PrivateConv.findByIdAndUpdate(this.conversation, {
        recentActivity: this.sentAt
    });
    await User.updateMany({
        _id: { $in: [conv.user, conv.correspondent] }
    }, {
        $addToSet: { updatedPrivateConversations: conv._id }
    });
};

const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = PrivateMessage;