const express = require('express');
const authController = require('./../controllers/authController');
const convController = require('./../controllers/conversationController');

const router = express.Router();

router.use(authController.protect);

router.route('/').
    post(convController.create);

module.exports = router;