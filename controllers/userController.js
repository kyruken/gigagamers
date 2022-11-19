const mongoose = require('mongoose');
const {body, check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
exports.get_user_form = (req, res) => {
    res.render('./users/user_form');
}
exports.post_user_form = (req, res, next) => {

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

    const errors = validationResult(req);

    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);

        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: hashedPassword,
            membershipstatus: req.body.membership
        })

    newUser.save();

    res.redirect('/');
    })
    
}

exports.get_user_login = (req, res) => {
    //Passport sends messages using req.session.messages, but you need to
    //set failureMessage: true in passport.authenticate
    res.render('./users/user_login',  { user: req.username, message: req.session.messages});
}

exports.post_user_login = (req, res) => {
    res.send('post user login');
}
