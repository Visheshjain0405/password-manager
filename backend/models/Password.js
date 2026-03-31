const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a site name']
    },
    username: {
        type: String,
        required: [true, 'Please add a username']
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    url: {
        type: String
    },
    category: {
        type: String,
        enum: ['Personal', 'Work', 'Social', 'Shopping', 'Finance', 'Other'],
        default: 'Personal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Password', PasswordSchema);
