const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

router.get('/', (req, res) => {
    res.render('homepage');
});

module.exports = router;