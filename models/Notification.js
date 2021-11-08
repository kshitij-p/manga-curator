const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    malID: Number,
    title: String
})

const Notification = new mongoose.model('Notification', notificationSchema);

module.exports = Notification;