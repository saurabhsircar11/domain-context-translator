const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    provider: {type: String, enum : ['google', 'facebook', 'github'], required: true},
    name: String,
    email: {type: String, lowercase: true},
    avatar: String,
    createdAt:{ type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);