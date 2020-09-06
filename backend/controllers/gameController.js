const Game = require('./../models/gameModel');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllGames = factory.getAll(Game, '-players -screenshots');
exports.getGame = factory.getOne(Game, '');
exports.createGame = factory.create(Game);
exports.updateGame = factory.update(Game);

exports.getPlayers = catchAsync(async (req, res, next) => {
    filter = { games: req.params.id }
    const query = User.find(filter)
        .select('-__v -passwordChangedAt -friends -pendingFriendRequests -receivedFriendRequests -deletedFriends -conversations -privileges -email -games');
    const features = new APIFeatures(query, req.query)
        .paginate(50);

    const players = await features.query;
    res.status(200).json({
        status: 'success',
        results: players.length,
        data: players
    });
});

exports.registerAsPlayer = catchAsync(async (req, res, next) => {
    let game = await Game.findById(req.params.id);

    if (!game) {
        return next(new AppError('This game does not exist', 404));
    }

    if (req.user.games.some(el => el.toString() === req.params.id)) {
        return next(new AppError('You\'re already on the list', 400));
    }

    user = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            games: req.params.id
        }
    }, {
        new: true
    });

    res.status(200).json({
        status: 'success',
        data: user
    });
});

exports.optOut = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: { games: req.params.id }
    }, {
        new: true
    });

    res.status(200).json({
        status: 'success',
        data: user
    });
}); 