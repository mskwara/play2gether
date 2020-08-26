const Game = require('./../models/gameModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllGames = factory.getAll(Game, '');
exports.getGame = factory.getOne(Game);
exports.createGame = factory.create(Game);

exports.registerAsPlayer = catchAsync(async (req, res, next) => {
    let game;
    await Game.findById(req.params.id, (err, doc) => {
        if (err) {
            return next(new AppError('This game does not exist', 404));
        }

        if (doc.players.some(el => el.toString() === req.user.id)) {
            return next(new AppError('You\'re already on the list'), 400);
        }

        doc.players.push(req.user.id);
        game = doc;
        doc.save();
    });

    if (game) {
        res.status(200).json({
            status: 'success',
            data: {
                game
            }
        });
    }
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