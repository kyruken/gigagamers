const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

router.get('/', (req, res) => {
    res.render('homepage');
});

//Creating a new user
router.get('/user_form/create', userController.get_user_form);
router.post('/user_form/create', userController.post_user_form);

//Logging in with an existing user
router.get('/user_login', userController.get_user_login);
router.post('/user_login', userController.post_user_login);

//Creating a new message
router.get('/message_form', messageController.get_message_form);
router.post('/message_form', messageController.post_message_form);



module.exports = router;