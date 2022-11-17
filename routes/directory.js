const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

router.get('/', (req, res) => {
    res.render("homepage", {user: req.user});
});

router.get('/log-out', (req, res) => {
    res.render("homepage", {message: "Logged out"});
});

//Creating a new user
router.get('/sign-up', userController.get_user_form);
router.post('/sign-up', userController.post_user_form);

//Logging in with an existing user
router.get('/log-in', userController.get_user_login);

//Creating a new message
router.get('/message_form', messageController.get_message_form);
router.post('/message_form', messageController.post_message_form);



module.exports = router;