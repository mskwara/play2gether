const User = require("./../models/userModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const PrivateConv = require("../models/privateConversationModel");
const GroupConv = require("../models/groupConversationModel");
const PrivateMessage = require("./../models/privateMessageModel");
const GroupMessage = require("./../models/groupMessageModel");
const AppError = require("../utils/appError");

exports.createGroupConversation = catchAsync(async (req, res, next) => {
    // Remove duplicates
    let unique = req.body.users;
    unique.push(req.user.id);
    unique = [...new Set(unique)];

    // Filter out non existing users
    unique = unique.filter(async (value) => {
        const user = await User.findById(value);
        if (!user) return false;
        return true;
    });

    if (unique.length < 3) {
        return next(
            new AppError("Not enough members for a group conversation")
        );
    }

    const newConv = await (await GroupConv.create({
        participants: unique,
        recentActivity: Date.now(),
    })).populate({
        path: 'participants',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -conversations -deletedFriends -email -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations'
    }).execPopulate();
    newConv.__v = undefined;

    await User.updateMany(
        {
            _id: { $in: unique },
        },
        {
            $push: {
                groupConversations: newConv._id,
            },
        }
    );

    res.status(201).json({
        status: "success",
        data: newConv
    });
});

exports.getPrivateConversationByUser = catchAsync(async (req, res, next) => {
    let user = req.user.id;
    let correspondent = req.params.userId;

    const corrUser = User.findById(correspondent);
    if (!corrUser) {
        return next(new AppError("This user does not exist", 404));
    }

    if (user > correspondent) [user, correspondent] = [correspondent, user];

    let privateConv = await PrivateConv.findOne({
        user,
        correspondent,
    });

    if (!privateConv)
        return next(
            new AppError("You have no conversation with that user", 404)
        );

    res.status(200).json({
        status: "success",
        data: privateConv,
    });
});

exports.createPrivateConv = catchAsync(async (req, res, next) => {
    let user = req.user.id;
    let correspondent = req.params.userId;

    const corrUser = User.findById(correspondent);
    if (!corrUser) {
        return next(new AppError("This user does not exist", 404));
    }

    if (user > correspondent) [user, correspondent] = [correspondent, user];

    let privateConv = await PrivateConv.findOne({
        user,
        correspondent,
    });

    if (privateConv)
        return res.status(200).json({
            status: "success",
            data: req.user,
        });

    privateConv = await PrivateConv.create({
        user,
        correspondent,
        recentActivity: Date.now(),
    });

    const userOBJ = await User.findByIdAndUpdate(user, {
        $push: {
            privateConversations: privateConv._id
        }
    }, {
        new: true
    });

    await User.findByIdAndUpdate(correspondent, {
        $push: {
            privateConversations: privateConv._id,
        }
    });

    res.status(201).json({
        status: "success",
        data: userOBJ
    });
});

exports.leaveGroupConversation = catchAsync(async (req, res, next) => {
    const conv = await GroupConv.findByIdAndUpdate(
        req.params.convId,
        {
            $pull: {
                participants: req.user.id,
            },
        },
        {
            new: true,
        }
    );

    if (!conv)
        return next(new AppError("There is no conversation with that Id", 404));

    if (conv.participants.length === 0)
        await GroupConv.findByIdAndDelete(req.params.convId);

    await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            groupConversations: req.params.convId,
        },
    });

    res.status(200).json({
        status: "success",
        data: null,
    });
});

exports.getAllPrivateConversations = catchAsync(async (req, res, next) => {
    const conversations = await PrivateConv.find({
        _id: { $in: req.user.privateConversations },
    });

    res.status(200).json({
        status: "success",
        results: conversations.length,
        data: conversations,
    });
});;

exports.getAllGroupConversations = catchAsync(async (req, res, next) => {
    const conversations = await GroupConv.find({
        _id: { $in: req.user.groupConversations },
    });

    res.status(200).json({
        status: "success",
        results: conversations.length,
        data: conversations,
    });
});;;

exports.getPrivateConversation = factory.getOne(PrivateConv);
exports.getGroupConversation = factory.getOne(GroupConv);

exports.getAllPrivateMessages = factory.getAll(PrivateMessage, "", "-sentAt");
exports.getAllGroupMessages = factory.getAll(GroupMessage, "", "-sentAt");

exports.sendPrivateMessage = catchAsync(async (req, res, next) => {
    if (!req.user.privateConversations.includes(req.params.id))
        return next(new AppError("You don't belong to that conversation", 403));

    const message = await PrivateMessage.create({
        conversation: req.params.id,
        from: req.user.id,
        sentAt: Date.now(),
        message: req.body.message,
    });

    res.status(200).json({
        status: "success",
        data: message,
    });
});

exports.sendGroupMessage = catchAsync(async (req, res, next) => {
    if (!req.user.groupConversations.includes(req.params.id))
        return next(new AppError("You don't belong to that conversation", 403));

    const message = await GroupMessage.create({
        conversation: req.params.id,
        from: req.user.id,
        sentAt: Date.now(),
        message: req.body.message,
    });

    res.status(200).json({
        status: "success",
        data: message,
    });
});
