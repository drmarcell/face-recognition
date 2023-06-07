const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    entries: {
        type: Number,
        required: false
    },
    joined: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('users', usersSchema);