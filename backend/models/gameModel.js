const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A game must have a title.']
    },
    description: {
        type: String,
        required: [true, 'What is that game about?'],
    },
    icon: {
        type: String,
        // Temporarily false
        required: [false, 'Provide an icon for this game.']
    },
    players: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User', 
        }
    ]
});

gameSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'players',
        select: '-__v -passwordChangedAt'
    });
    
    next();
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;