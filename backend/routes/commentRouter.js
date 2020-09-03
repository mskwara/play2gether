const express = require('express');
const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/:userId')
    .get(commentController.getAllComments)
    .post(commentController.postComment,
        commentController.getAllComments)

router.delete('/:commId', commentController.deleteComment);

module.exports = router;
