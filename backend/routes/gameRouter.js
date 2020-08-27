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

router.route('/:id/membership')
    .post(
        authController.protect,
        gameController.registerAsPlayer
    )
    .patch(
        authController.protect,
        gameController.optOut
    );


module.exports = router;