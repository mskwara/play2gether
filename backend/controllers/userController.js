const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const userSlimDown = require("./../utils/userSlimDown");

function filterObj(obj, ...excludedFields) {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (!excludedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("It's not an image!", 404), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("photo");

exports.resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user._id.toString()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(null, 480)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${__dirname}\\..\\static\\users\\${req.file.filename}`);

    next();
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .populate({
            path: "games",
            select: "-__v -screenshots",
        })
        .select(
            "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -email -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -praisedPlayers"
        );

    if (!user) {
        return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: user,
    });
});

exports.getAllUsers = factory.getAll(User, "");

exports.update = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(
        req.body,
        "password",
        "passwordConfirm",
        "photo",
        "requests",
        "friends"
    );

    if (req.file) {
        filteredBody.photo = req.file.filename;
        if (req.user.photo !== "defaultUser.jpeg") {
            await fs.unlink(
                `${__dirname}\\..\\static\\users\\${req.user.photo}`,
                (err) => {
                    if (err) console.log(err);
                }
            );
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filteredBody,
        {
            select:
                "-passwordChangedAt -privateConversations -groupConversations",
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
    if (req.user.photo !== "defaultUser.jpeg") {
        await fs.unlink(
            `${__dirname}\\..\\static\\users\\${req.user.photo}`,
            (err) => {
                if (err) console.log(err);
            }
        );

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { photo: "defaultUser.jpeg" },
            {
                select:
                    "-passwordChangedAt -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
            }
        );
        res.status(200).json({
            status: "success",
            data: user,
        });
    } else {
        return next(new AppError("You can't remove a default photo"));
    }
});

exports.getMe = catchAsync(async (req, res, next) => {
    req.user = userSlimDown(req.user);
    res.status(200).json({
        status: "success",
        data: req.user,
        token: req.token,
    });
});

exports.addFriend = catchAsync(async (req, res, next) => {
    if (req.params.id === req.user._id.toString())
        return next(
            new AppError(
                "Sorry, you can't invite yourself to your friends",
                400
            )
        );

    if (
        req.user.pendingFriendRequests.some(
            (el) => el._id.toString() === req.params.id
        )
    )
        return next(
            new AppError("You've already sent an invitation to this user", 400)
        );

    if (req.user.friends.some((el) => el._id.toString() === req.params.id))
        return next(new AppError("This user is already your friend", 400));

    if (
        req.user.receivedFriendRequests.some(
            (el) => el._id.toString() === req.params.id
        )
    )
        return next(
            new AppError(
                "You've already got an invitation from this user.",
                400
            )
        );

    await User.findByIdAndUpdate(req.params.id, {
        $push: {
            receivedFriendRequests: req.user._id,
        },
    });

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                pendingFriendRequests: req.params.id,
            },
        },
        {
            select:
                "-passwordChangedAt -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
            new: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: user,
    });
});

exports.acceptFriend = catchAsync(async (req, res, next) => {
    if (
        !req.user.receivedFriendRequests.some(
            (el) => el._id.toString() === req.params.id.toString()
        )
    )
        return next(
            new AppError("You have no invitation with that user ID", 400)
        );

    req.user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                receivedFriendRequests: req.params.id,
            },
            $push: {
                friends: req.params.id,
            },
        },
        {
            select:
                "-passwordChangedAt -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
            new: true,
        }
    );

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            pendingFriendRequests: req.user._id,
        },
        $push: {
            friends: req.user._id,
        },
    });

    req.params.userId = req.params.id;
    next();
});

exports.ignoreFriend = catchAsync(async (req, res, next) => {
    if (
        !req.user.receivedFriendRequests.some(
            (el) => el._id.toString() === req.params.id.toString()
        )
    )
        return next(
            new AppError("You have no invitation with that user ID", 400)
        );

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                receivedFriendRequests: req.params.id,
            },
        },
        {
            select:
                "-passwordChangedAt -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
            new: true,
        }
    );

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            pendingFriendRequests: req.user._id,
        },
    });

    res.status(200).json({
        status: "success",
        data: user,
    });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                friends: req.params.id,
            },
        },
        {
            select:
                "-passwordChangedAt -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
            new: true,
        }
    );

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            friends: req.user._id,
        },
    });

    res.status(200).json({
        status: "success",
        data: user,
    });
});

exports.changeUserPraise = catchAsync(async (req, res, next) => {
    if (req.user._id.toString() === req.params.id)
        return next(new AppError("You can't praise yourself", 400));

    let friendly, skilledPlayer, goodTeacher;
    const praise = req.user.praisedPlayers.find(el => req.params.id === el.user.toString());
    if (!praise) {
        friendly = req.body.friendly ? 1 : 0;
        goodTeacher = req.body.goodTeacher ? 1 : 0;
        skilledPlayer = req.body.skilledPlayer ? 1 : 0;
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                praisedPlayers: {
                    user: req.params.id,
                    friendly: req.body.friendly || false,
                    goodTeacher: req.body.goodTeacher || false,
                    skilledPlayer: req.body.skilledPlayer || false
                }
            }
        });
    } else {
        friendly = req.body.friendly && !praise.friendly ? 1 : -1;
        friendly = !req.body.friendly ? 0 : friendly;
        skilledPlayer = req.body.skilledPlayer && !praise.skilledPlayer ? 1 : -1;
        skilledPlayer = !req.body.skilledPlayer ? 0 : skilledPlayer;
        goodTeacher = req.body.goodTeacher && !praise.goodTeacher ? 1 : -1;
        goodTeacher = !req.body.goodTeacher ? 0 : goodTeacher;

        await User.updateOne({ _id: req.user._id, 'praisedPlayers.user': req.params.id }, {
            $set: {
                'praisedPlayers.$.friendly': req.body.friendly ^ praise.friendly,
                'praisedPlayers.$.goodTeacher': req.body.goodTeacher ^ praise.goodTeacher,
                'praisedPlayers.$.skilledPlayer': req.body.skilledPlayer ^ praise.skilledPlayer
            }
        });
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
        $inc: {
            friendly,
            skilledPlayer,
            goodTeacher
        }
    }, {
        select: "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -praisedPlayers",
        new: true,
    }).populate({
        path: 'games',
        select: '-__v -screenshots'
    });

    res.status(200).json({
        status: "success",
        data: user,
    });
});
