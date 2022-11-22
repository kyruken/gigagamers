const { localsName } = require('ejs');
const mongoose = require('mongoose');
const message = require('../models/message');
const Message = require('../models/message')
const User = require('../models/user')
const {body, check, validationResult} = require('express-validator')

const async = require('async');
const user = require('../models/user');

exports.get_message_form = (req, res) => {
    res.render('./messages/message_form');
}

exports.post_message_form = [
    
    body('title', "title must not be empty")
    .trim()
    .isLength({min: 1, max: 50})
    .escape(),
    body('body', "body must not be empty")
    .trim()
    .isLength({min:1, max: 100})
    .escape(),


    (req, res, next) => {

        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return `* ${msg} *`;
          };
    
        const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {
            console.log("swaggyialsdlsad");
            res.render('./messages/message_form', {error: errors.array()});
            return;
        }

        const newMessage = new Message({
            title: req.body.title,
            body: req.body.body,
            author: req.body.author,
            date: new Date()
        })


        //If you change properties locally on models, you have to save
        //before updating to db!!!!
        const newUser = res.locals.currentUser;
        newUser.message.push(newMessage);

        newUser.save();

        newMessage.save();

        User.findByIdAndUpdate(req.body.authorid, newUser, (err, updatedUser) => {
            if(err) {
                return next(err);
            }

            res.redirect('/');
            
        })
}
]

exports.get_message_detail = (req, res, next) => {

    async.parallel({
        user(callback) {
            User.where('message').equals(req.params.id).findOne().exec(callback);
        },
        message(callback) {
            Message.findById(req.params.id).exec(callback);
        },

    }, (err, results) => {

        if (err) {
            return next(err);
        }

        res.render('./messages/message_detail', {
            post: results.message,
            title: results.message.title,
            //weird bug where you can't use the property "body" or else its bugged
            description: results.message.body,  
            username: results.user.username
        })
    })
}

exports.post_message_detail = (req, res) => {
    
}

exports.get_delete_message = (req, res) => {

    async.parallel({
        user(callback) {
            User.where('message').equals(req.params.id).findOne().exec(callback);
        },
        message(callback) {
            Message.findById(req.params.id).exec(callback);
        },

    }, (err, results) => {

        if (err) {
            return next(err);
        }

        res.render('./messages/message_delete', {
            title: results.message.title,
            //weird bug where you can't use the property "body" or else its bugged
            description: results.message.body,  
            username: results.user.username,
            message: "Are you sure you want to delete this post?"
        })
    })

}

exports.post_delete_message = (req, res, next) => {

    async.parallel({
        user(callback) {
            User.where('message').equals(req.params.id).findOne().exec(callback);
        },
        message(callback) {
            Message.findById(req.params.id).exec(callback);
        },

    }, (err, results) => {

        if (err) {
            return next(err);
        }

        console.log("author: ", results.user._id);
        console.log("currentuserid: ", res.locals.currentUser._id);
        //Make sure to use toString when comparing ._id 's otherwise comparison won't work
        if (res.locals.currentUser._id.toString() === results.user._id.toString() || res.locals.currentUser.admin === true) {
            Message.findByIdAndDelete(req.params.id, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            })
        } else {
            res.render('./messages/message_delete', {
                title: results.message.title,
                //weird bug where you can't use the property "body" or else its bugged
                description: results.message.body,  
                username: results.user.username,
                message: "User is not admin or author. Can't delete post."
            })
        }
    })

}