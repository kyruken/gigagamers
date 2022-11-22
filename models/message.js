const mongoose = require('mongoose');
const {DateTime} = require('luxon');

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

messageSchema.virtual("date_formatted").get(function() {
    let year = DateTime.fromJSDate(this.timestamp).year;
    let month = DateTime.fromJSDate(this.timestamp).month;
    let day = DateTime.fromJSDate(this.timestamp).day;

    let meridiem = "AM";
    let hour = DateTime.fromJSDate(this.timestamp).hour;
    if (hour > 12) {
        hour = parseInt(hour / 12)
        meridiem = "PM";
    }
    let minute = DateTime.fromJSDate(this.timestamp).minute;

    return `${year}-${month}-${day}, ${hour}:${minute}${meridiem}`;
})

module.exports = mongoose.model("Message", messageSchema);