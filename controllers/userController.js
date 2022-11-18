const mongoose = require('mongoose');
const {body, validationResults} = require('express-validator');
const User = require('../models/user');
exports.get_user_form = (req, res) => {
    res.render('./users/user_form');
}
exports.post_user_form = (req, res) => {
    const newUser = new User({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        userName: req.body.username,
        password: req.body.password,
        membershipStatus: req.body.membership
    })

    body("firstname", "First name must not be empty")
    .trim()
    .isLength({min: 1, max: 50})
    .escape()
    body("lastname", "Last name must not be empty")
    .trim()
    .isLength({min: 1, max: 50})
    .escape()
    body("username", "Username must not be empty")
    .trim()
    .isLength({min: 1, max:20})
    .escape()
    body("password", "Password must not be empty")
    .trim()
    .isLength({min: 1, max: 16})
    .escape()


    newUser.save();

    res.redirect('/user_login');
    
}

exports.get_user_login = (req, res) => {
    res.render('./users/user_login',  { user: req.username });
}

exports.post_user_login = (req, res) => {
    res.send('post user login');
}
