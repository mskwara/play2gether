const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const convController = require('./conversationController');

function filterObj(obj, ...excludedFields) {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (!excludedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
}

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('It\'s not an image!', 404), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.file)
        return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(null, 480)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${__dirname}\\..\\static\\users\\${req.file.filename}`);

    next();
});

exports.getAllUsers = factory.getAll(User, "");

exports.update = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body,
        'password', 'passwordConfirm',
        'photo', 'requests', 'friends'
    );

    if (req.file) {
        filteredBody.photo = req.file.filename;
    }

    if (req.user.photo !== 'defaultUser.jpeg') {
        await fs.unlink(`${__dirname}\\..\\static\\users\\${req.user.photo}`, (err) => {
            if (err) console.log(err);
        });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            data: updatedUser
        }
    });
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
    await fs.unlink(`${__dirname}\\..\\static\\users\\${req.user.photo}`, (err) => {
        if (err) console.log(err);
    });
    req.user.photo = 'defaultUser.jpeg';
    res.status(200).json({
        status: "success",
        user: req.user,
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    });
});

exports.addFriend = catchAsync(async (req, res, next) => {
    if (req.params.id === req.user.id)
        return next(new AppError('Sorry, you can\'t invite yourself to your friends', 400));

    if (req.user.pendingFriendRequests.includes(req.params.id))
        return next(new AppError('You\'ve already sent an invitation to this user', 400));

    await User.findByIdAndUpdate(req.params.id, {
        $push: {
            receivedFriendRequests: req.user.id
        }
    });

    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            pendingFriendRequests: req.user.id
        }
    });

    res.status(200).json({
        status: 'success',
        user
    });
});

exports.acceptFriend = catchAsync(async (req, res, next) => {
    if (!req.user.requests.includes(req.params.id))
        return next(new AppError('You have no invitation with that user ID', 400));

    const user = await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            receivedFriendRequests: req.user.id
        },
        $push: {
            friends: req.user.id
        }
    });

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            pendingFriendRequests: req.user.id
        },
        $push: {
            friends: req.user.id
        }
    });

    // Create conversation
    req.body.users = [req.params.id]
    next();
});

exports.ignoreFriend = catchAsync(async (req, res, next) => {
    if (!req.user.requests.includes(req.params.id))
        return next(new AppError('You have no invitation with that user ID', 400));

    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            receivedFriendRequests: req.params.id
        }
    });

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            pendingFriendRequests: req.user.id
        }
    });

    res.status(200).json({
        status: 'success',
        user
    });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            friends: req.params.id
        }
    });

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            friends: req.user.id
        }
    });

    res.status(200).json({
        status: 'success',
        user
    })
});
