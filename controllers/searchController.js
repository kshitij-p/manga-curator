const fetch = require('node-fetch');
const makeList = require('../utils/makeList.js');

const Cache = require('../models/Cache');

const searchCache = require('../utils/searchCache');
const CustomError = require('../utils/customError');

module.exports.search = async (req, res, next) => {
    res.render('searchpage/searchpage.ejs')
}

module.exports.getList = async (req, res, next) => {

    let { name: query } = req.params;
    let raw = await fetch(`https://api.jikan.moe/v3/search/manga?q=${query}&limit=5`);

    if(raw.status !== 200){
        throw new CustomError('Something went wrong - API might be temporarily down.', raw.status);
    }
    let parsed = await raw.json();
    
    let { results: data } = parsed;

    
    res.render('searchlist/searchlist.ejs', { data });
}

module.exports.getSimilar = async (req, res, next) => {
    let { id } = req.params;
    let cache = await searchCache(id);

    if (cache) {
        let data = { source: cache.source, data: cache.similarList, cached: true };


        return res.render('searchsimilar/searchsimilar.ejs', { data });
    } else {
      

        let data = await makeList(id);
        let key;

        if (data.data) {
            key = 'data';
        } else if (data.tempData) {
            key = 'tempData';
        }


        if (data[key].includes(data.source.mal_id)) {
            data[key].splice(data[key].indexOf(data.source.mal_id), 1);
        }
        data.cached = false;

        return res.render('searchsimilar/searchsimilar.ejs', { data });


    }


}


module.exports.postSimilarCache = async (req, res, next) => {

    let { id, source, similarList } = req.body;

    let cache = await new Cache({ id, source, similarList });
    await cache.save();

    return res.json(200);
}