const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please tell us your name!"],
        },
        email: {
            type: String,
            required: [true, "You need to specify your email!"],
            unique: true,
            lowercase: true,
            // validate: [validator.isEmail, 'Please provide a valid email!']
        },
        password: {
            type: String,
            required: [true, "Please specify your password"],
            // minlength: 8,
            maxlength: 32,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "Passwords are not the same!",
            },
        },
        passwordChangedAt: Date,
        photo: {
            type: String,
            default: "defaultUser.jpeg",
        },
        games: [{
            type: mongoose.Schema.ObjectId,
            ref: "Game",
        }],
        friends: [{
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }],
        receivedFriendRequests: [{
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }],
        pendingFriendRequests: [{
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }],
        privateConversations: [{
            type: mongoose.Schema.ObjectId,
            ref: "PrivateConversation",
        }],
        groupConversations: [{
            type: mongoose.Schema.ObjectId,
            ref: "Conversation",
        }],
        updatedPrivateConversations: [{
            type: mongoose.Schema.ObjectId,
            ref: "Conversation",
        }],
        updatedGroupConversations: [{
            type: mongoose.Schema.ObjectId,
            ref: "Conversation",
        }],
        privileges: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            select: false,
        },
        aboutMe: {
            type: String,
        },
        recentActivity: {
            type: Date
        },
        friendly: {
            type: Number,
            default: 0,
        },
        goodTeacher: {
            type: Number,
            default: 0,
        },
        skilledPlayer: {
            type: Number,
            default: 0,
        },
        praisedPlayers: [{
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            friendly: Boolean,
            goodTeacher: Boolean,
            skilledPlayer: Boolean,
            _id: false
        }]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false
    }
);

userSchema.index({ name: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.idNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.post("save", function (err, doc, next) {
    this.__v = undefined;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.populate({
        path: "friends",
        select: "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
    }).populate({
        path: "receivedFriendRequests",
        select: "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
    }).populate({
        path: "pendingFriendRequests",
        select: "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -games -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers",
    }).select("-__v");

    next();
});

// // Update schema (comment out all middleware above)
// userSchema.post('find', async function (docs) {
//     for (const doc of docs) {
//         console.log(doc);
//         doc.praisedPlayers = [];
//         doc.friendly = 0;
//         doc.goodTeacher = 0;
//         doc.skilledPlayer = 0;
//         await doc.save({ validateBeforeSave: false });
//     }
// });

userSchema.methods.correctPassword = async function (
    providedPassword,
    hashedPassword
) {
    return await bcrypt.compare(providedPassword, hashedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
