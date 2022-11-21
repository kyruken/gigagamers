const mongoose = require('mongoose');
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.get_user_form = (req, res) => {
    res.render('./users/user_form');
}

exports.post_user_form = [

    body("firstname", "First name must not be empty")
    .trim()
    .isLength({min: 1, max: 50})
    .escape(),
    body("lastname", "Last name must not be empty")
    .trim()
    .isLength({min: 1, max: 50})
    .escape(),
    body("username", "Username must not be empty")
    .trim()
    .isLength({min: 1, max:20})
    .escape(),
    body("password", "Password must not be empty")
    .trim()
    .isLength({min: 1, max: 16})
    .escape(),

    (req, res, next) => {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return `* ${msg} *`;
          };
    
        const errors = validationResult(req).formatWith(errorFormatter);
        
        if (!errors.isEmpty()) {
            console.log("swaggyialsdlsad");
            res.render('./users/user_form', {error: errors.array()});
            return;
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
]

exports.get_user_login = (req, res) => {
    //Passport sends messages using req.session.messages, but you need to
    //set failureMessage: true in passport.authenticate
    res.render('./users/user_login',  { user: req.username, message: req.session.messages});
}

exports.post_user_login = (req, res) => {
    res.send('post user login');
}
