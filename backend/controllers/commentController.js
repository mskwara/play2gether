const Comment = require('./../models/commentModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllComments = factory.getAll(Comment, '', '-sentAt');

exports.postComment = catchAsync(async (req, res, next) => {
    if (req.user._id.toString() === req.params.userId)
        return next(new AppError('You can\'t comment about yourself.', 400));

    await Comment.create({
        user: req.params.userId,
        from: req.user._id,
        sentAt: Date.now(),
        comment: req.body.comment
    });

    next();
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commId);

    if (!comment)
        return next(new AppError('No comment found with that ID.', 404));

    console.log(comment.user, req.user._id, comment.from)
    if (comment.user.toString() === req.user._id.toString() || comment.from._id.toString() === req.user._id.toString()) {
        await Comment.findByIdAndDelete(comment._id);
    } else {
        return next(new AppError('You have no rights to delete that comment.', 403));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});