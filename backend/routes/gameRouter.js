const express = require('express');
const gameController = require('./../controllers/gameController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
    .get(gameController.getAllGames)
    .post(gameController.createGame);

router.route('/:id')
    .get(gameController.getGame)
    .patch(gameController.updateGame);

router.patch('/:id/registerAsPlayer',
    authController.protect,
    gameController.registerAsPlayer
);

router.patch('/:id/optOut',
    authController.protect,
    gameController.optOut
);


module.exports = router;