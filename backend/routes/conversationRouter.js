const express = require('express');
const authController = require('./../controllers/authController');
const convController = require('./../controllers/conversationController');

const router = express.Router();

router.use(authController.protect);

router.route('/private/user/:userId')
    .get(convController.getPrivateConversationByUser)
    .post(convController.createPrivateConv);

router.route('/private/:id')
    .get(convController.getPrivateConversation)
    .post(convController.sendPrivateMessage);

router.route('/private')
    .get(convController.getAllPrivateConversations);

router.get('/private/:convId/messages', convController.getAllPrivateMessages)

router.route('/group/:id')
    .get(convController.getGroupConversation)
    .post(convController.sendGroupMessage);

router.route('/group')
    .get(convController.getAllGroupConversations)
    .post(convController.createGroupConversation);

router.get('/group/:convId/messages', convController.getAllGroupMessages)

router.patch('/group/:convId/leave', convController.leaveGroupConversation);

module.exports = router;