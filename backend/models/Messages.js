const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sentOn : {
        type: Date,
        default: new Date()
    }
})

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;