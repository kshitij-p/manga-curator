const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
    id: Number,
    source: Object,
    similarList: Object,
    createdAt: { type: Date, expires: 3600, default: Date.now }
})

const Cache = new mongoose.model('Cache', cacheSchema);

module.exports = Cache;