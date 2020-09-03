const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.ObjectId,
        ref: 'Conversation',
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;