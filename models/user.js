const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message"
    }],
    membershipStatus: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);