const mongoose = require('mongoose');
const slugify = require('slugify');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A game must have a title.']
    },
    description: {
        type: String,
        required: [true, 'What is that game about?'],
    },
    players: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    icon: {
        type: String,
        // Temporarily false
        required: [false, 'Provide an icon for this game.']
    },
    screenshots: [{ type: String }]
});

gameSchema.pre('save', function (next) {
    this.icon = slugify(this.title, { lower: true });
    next();
});

// gameSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'players',
//         select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -email'
//     });

//     next();
// });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;