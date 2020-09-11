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
        games: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Game",
            },
        ],
        friends: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
        receivedFriendRequests: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
        pendingFriendRequests: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
        privateConversations: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "PrivateConversation",
            },
        ],
        groupConversations: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Conversation",
            },
        ],
        updatedPrivateConversations: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Conversation",
            },
        ],
        updatedGroupConversations: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Conversation",
            },
        ],
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
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

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
        select:
            "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -games -privateConversations -groupConversations",
    })
        .populate({
            path: "receivedFriendRequests",
            select:
                "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -games -privateConversations -groupConversations",
        })
        .populate({
            path: "pendingFriendRequests",
            select:
                "-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -games -privateConversations -groupConversations",
        })
        .select("-__v");

    next();
});

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
