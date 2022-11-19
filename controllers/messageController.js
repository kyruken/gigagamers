const mongoose = require('mongoose');
const Message = require('../models/message')
const User = require('../models/user')

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


    newMessage.save();

    User.findByIdAndUpdate(req.body.authorid, {message: newMessage}, (err, updatedUser) => {
        if(err) {
            return next(err);
        }

        res.redirect(newMessage.url);
        
    })

}

exports.get_message_detail = (req, res) => {
    res.send("get message page");

}

exports.post_message_detail = (req, res) => {
    
}