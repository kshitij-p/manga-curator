const fetch = require('node-fetch');
const CustomError = require('./customError');


const delay = (delayTime)=> {
    return new Promise((resolve)=> {
        setTimeout(()=> {
            resolve('');
        }, 2000)
    })
}

const makeList = async (id) => {
    let rawRecommends = await fetch(`https://api.jikan.moe/v3/manga/${id}/recommendations`);
    let parsedRecommends = await rawRecommends.json();

    let tempData = [];
    let temp = {};
    if (rawRecommends.ok) {



        let recommendsData = parsedRecommends.recommendations;
        

        for (let i = 0; i < recommendsData.length; i++) {
            if (i == 5) { break };
            tempData.push(parseInt(recommendsData[i].mal_id));
        }
    }
    

    let rawSource = await fetch(`https://api.jikan.moe/v3/manga/${id}`);
    
    if(!rawSource.ok){
        throw new CustomError('The MAL API is temporarily down  (usually for a few seconds or so) or bad request, try again later', 500);
    }

    if(rawSource.status != 200){
        throw new CustomError('The MAL API is temporarily down  (usually for a few seconds or so) or bad request, try again later', 500);
    }
   
    let source = await rawSource.json();

    if (rawSource.ok) {
        let genres = source.genres;
        
        
        for (let i of source.genres) {
            
            await delay(2000);
            let rawGenres = await fetch(`https://api.jikan.moe/v3/genre/manga/${i.mal_id}/`);
                        
            
            if (!rawGenres.ok) continue;

            let parsedGenres = await rawGenres.json();

            for (let i = 1; i < parsedGenres.manga.length; i++) {

                if (i == 6) { break }

                if (!temp[parsedGenres.manga[i].mal_id]) {
                    temp[parsedGenres.manga[i].mal_id] = 1;
                }
            }

        }

        

        let tempKeys = Object.keys(temp);
        

        for (let i = 0; i < tempKeys.length; i++) {
            tempData.push(parseInt(tempKeys[i]));
        }

        /* Remove duplicates */
        tempData = new Set(tempData);
        let data = [];

        for (let i of tempData) {
            data.push(i);
        }

        /* Pass the source so we dont have to call for it again later */
        let result = { data, source };
        return result;
    }
    else {
        result = {tempData, source};
        return result;
    }
}

module.exports = makeList;