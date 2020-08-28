const User = require('./../models/userModel');
const Conv = require('./../models/conversationModel');
const catchAsync = require('./../utils/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
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