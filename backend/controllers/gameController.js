const Game = require('./../models/gameModel');
const factory = require('./handlerFactory');

exports.getAllGames = factory.getAll(Game, '');
exports.createGame = factory.create(Game);