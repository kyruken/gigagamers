const mongoose = require('mongoose');
const User = require('../models/user');
exports.get_user_form = (req, res) => {
    res.render('./users/user_form');
}
exports.post_user_form = (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password,
        membershipStatus: req.body.membershipStatus
    })

    newUser.save();

    res.redirect('/user_login');
    
}

exports.get_user_login = (req, res) => {
    res.render('./users/user_login')
}

exports.post_user_login = (req, res) => {
    res.send('post user login');
}
