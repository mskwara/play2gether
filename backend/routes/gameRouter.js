const express = require('express');
const gameController = require('./../controllers/gameController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
    .get(gameController.getAllGames)
    .post(gameController.createGame);

router.use(authController.protect);

router.route('/:id')
    .get(gameController.getGame)
    .patch(gameController.updateGame);

router.get('/:id/players', gameController.getPlayers);

router.patch('/:id/registerAsPlayer',
    gameController.registerAsPlayer
);

router.patch('/:id/optOut',
    gameController.optOut
);


module.exports = router;