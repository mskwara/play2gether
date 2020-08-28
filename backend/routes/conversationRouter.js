const express = require('express');
const authController = require('./../controllers/authController');
const convController = require('./../controllers/conversationController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .post(convController.create);

router.route('/:id')
    .get(convController.getConversation)
    .post(convController.sendMessage,
        convController.getAllMessages
    );

router.get('/:id/messages', convController.getAllMessages)

router.patch('/:id/leave', convController.leave);

module.exports = router;