const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
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
    membershipstatus: {
        type: Boolean,
        required: true
    },
    admin: {
        type: Boolean,
    }
})

module.exports = mongoose.model('User', userSchema);