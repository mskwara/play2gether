const User = require('./../models/userModel');
const Conv = require('./../models/conversationModel');
const Message = require('./../models/messageModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const Conversation = require('./../models/conversationModel');

exports.create = catchAsync(async (req, res, next) => {
    // Has someone previously been your friend
    if (!req.body.group && req.user.deletedFriends.includes(req.body.users[0])) {
        return res.status(200).json({
            status: 'success',
            user: req.user
        });
    }
    // Remove duplicates
    let unique = req.body.users;
    unique = [...new Set(unique)];

    // Filter out non existing users
    unique = unique.filter(async (value) => {
        const user = await User.findById(value);
        if (!user)
            return false;
        return true;
    });

    if (unique.length < 1) {
        return next(new AppError('Not enough members for a conversation'));
    }

    unique.push(req.user.id);
    const newConv = await Conv.create({
        participants: [...unique],
        recentActivity: Date.now()
    });

    await User.updateMany({
        _id: { $in: unique }
    }, {
        $push: {
            conversations: newConv._id
        }
    });

    const user = await User.findById(req.user.id);

    res.status(201).json({
        status: 'success',
        user
    });
});

exports.leave = catchAsync(async (req, res, next) => {
    const conv = await Conv.findByIdAndUpdate(req.params.id, {
        $pull: {
            participants: req.user.id
        }
    }, {
        new: true
    });

    if (conv.participants.length === 0)
        await Conv.findByIdAndDelete(req.params.id);

    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            conversations: req.params.id
        }
    }, {
        new: true
    });

    res.status(200).json({
        status: 'success',
        user
    });
});

exports.getAllMessages = factory.getAll(Message, '', '-sentAt');

exports.getConversation = factory.getOne(Conversation, '');

exports.sendMessage = catchAsync(async (req, res, next) => {
    await Message.create({
        conversation: req.params.id,
        from: req.user.id,
        sentAt: Date.now(),
        message: req.body.message
    });
    next();
});