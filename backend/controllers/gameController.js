const Game = require('./../models/gameModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllGames = factory.getAll(Game, '-players -screenshots');
exports.getGame = factory.getOne(Game, '', {
        path: 'players',
        select: '-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -email'
    });
exports.createGame = factory.create(Game);
exports.updateGame = factory.update(Game);

exports.registerAsPlayer = catchAsync(async (req, res, next) => {
    let game = await Game.findById(req.params.id);

    if (!game) {
        return next(new AppError('This game does not exist', 404));
    }

    if (game.players.some(el => el._id.toString() === req.user.id)) {
        return next(new AppError('You\'re already on the list', 400));
    }

    game = await Game.findByIdAndUpdate(req.params.id, {
        $push: {
            players: req.user.id
        }
    }, {
        new: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            game
        }
    });
});

exports.optOut = catchAsync(async (req, res, next) => {
    const game = await Game.findByIdAndUpdate(req.params.id, {
        $pull: { players: req.user.id }
    }, {
        new: true
    });

    if (!game) {
        return next(new AppError('This game does not exist', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            game
        }
    });
}); 