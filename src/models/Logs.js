const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    uid: {
        type: String,
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