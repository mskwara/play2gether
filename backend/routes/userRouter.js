const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const convController = require('./../controllers/conversationController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use(authController.protect);

router.route('/me')
    .get(userController.getMe)
    .patch(
        userController.uploadPhoto,
        userController.resizePhoto,
        userController.update
    );

router.patch('/:id/addFriend', userController.addFriend);
router.patch('/:id/acceptFriend',
    userController.acceptFriend,
    convController.create
    );
router.patch('/:id/ignoreFriend', userController.ignoreFriend);
router.patch('/:id/removeFriend', userController.removeFriend);


router.patch('/me/deletePhoto',
    userController.deletePhoto
);

router.get('/', userController.getAllUsers);


module.exports = router;