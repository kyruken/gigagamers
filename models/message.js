const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    timestamp: {
        type: Date,
    },
})

messageSchema.virtual('url').get(function() {
    return `/post/${this._id}`;
})

module.exports = mongoose.model("Message", messageSchema);