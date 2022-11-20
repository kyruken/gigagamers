const { localsName } = require('ejs');
const mongoose = require('mongoose');
const message = require('../models/message');
const Message = require('../models/message')
const User = require('../models/user')

const async = require('async');
const user = require('../models/user');

exports.get_message_form = (req, res) => {
    res.render('./messages/message_form');
}

exports.post_message_form = (req, res, next) => {

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
            title: results.message.title,
            //weird bug where you can't use the property "body" or else its bugged
            description: results.message.body,  
            username: results.user.username
        })
    })
}

exports.post_message_detail = (req, res) => {
    
}