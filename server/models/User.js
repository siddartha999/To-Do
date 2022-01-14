/**
 * Modelling a Schema for the User collection.
 */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profilePicUrl: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema); 