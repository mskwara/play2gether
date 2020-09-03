const express = require('express');
const authController = require('./../controllers/authController');
const convController = require('./../controllers/conversationController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .post(convController.create)
    .get(convController.getAllConversations);

router.route('/:id')
    .get(convController.getConversation)
    .post(convController.sendMessage);

router.get('/:convId/messages', convController.getAllMessages)

router.patch('/:id/leave', convController.leave);

module.exports = router;