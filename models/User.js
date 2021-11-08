const mongoose = require('mongoose');
const LocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification' 
    }],
    resetLink: String,
    resetHash: String,
    verified: Boolean,
    verifyDecimal: String,
    verifyLink: String,
    expiry: {type: Date, default: Date.now, expires: 604800}
})

userSchema.plugin(LocalMongoose);

const User = new mongoose.model('User', userSchema);

module.exports = User;
