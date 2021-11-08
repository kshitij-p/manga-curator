const mongoose = require('mongoose');
const Cache = require('../models/Cache');

const searchCache = async(srcid)=> {
    let cache = await Cache.findOne({id: srcid});
    if(cache) {
        return cache;
    }
    else {
        return null;
    }
}

module.exports = searchCache;