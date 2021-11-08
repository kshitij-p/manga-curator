const fetch = require('node-fetch');
const CustomError = require('../utils/customError');
const Redis = require('redis');

const REDISURL = process.env.REDIS_URL || '';


const redisClient = Redis.createClient({
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS
});


module.exports.redirectToSearch = async(req, res, next)=> {
    res.redirect('/search');
}

module.exports.getManga = async(req, res, next)=> {
    let {id} = req.params;
   
    redisClient.get(id, async(error, result)=> {
        if(error) console.log(error);
        
        if(result != null) {
            let data = JSON.parse(result);
            
            return res.render('showmanga/showmanga.ejs', {data});
        } else {
            let raw = await fetch(`https://api.jikan.moe/v3/manga/${id}`);

            if(!raw.ok){
                throw new Error("Invalid search!")
            }
            if(raw.status !== 200) {
                throw new CustomError('Something went wrong', raw.status);
            }
        
            
            let data = await raw.json();
        
            redisClient.setex(id, 3600, JSON.stringify(data));
                
        
            res.render('showmanga/showmanga.ejs', {data});
        }
    })

   
}