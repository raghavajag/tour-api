const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    uid: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
});


module.exports = mongoose.model('Log', LogSchema);