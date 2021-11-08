
let curtain = document.createElement('div');

curtain.classList.add('loader-container')
curtain.innerHTML = `<div class="loader"></div><b class="loader-text">Fetching similar</b>
                    <div class="loadbar-container">
                    <div class="load-bar"></div>
                    </div>`

let body = document.querySelector('body');

/* Hide elements */
for (let i of body.children) {
    i.style.display = "none";
}


body.prepend(curtain);

let finalArray = [];

const compareGenres = (source, target) => {
    let sourceGenreList = {};
    let targetGenreList = {};
    let counter = 0;


    for (let i of source.genres) {
        sourceGenreList[i.name] = sourceGenreList[i.name] + 1 || 1;
    }

    for (let i of target.genres) {
        targetGenreList[i.name] = targetGenreList[i.name] + 1 || 1;
    }

    for (let i of source.genres) {

        if (targetGenreList[i.name] >= sourceGenreList[i.name]) {
            counter++;
        }

        if (counter >= 1) {
            finalArray.push(target);
            return true;
        }
    }


    return false;
}

const compareThemes = (source, target) => {

    let sourceThemeList = {};
    let targetThemeList = {};

    if (!source.themes.length) { return false };

    for (let i of source.themes) {
        sourceThemeList[i.name] = sourceThemeList[i.name] + 1 || 1;
    }

    for (let i of target.themes) {
        targetThemeList[i.name] = targetThemeList[i.name] + 1 || 1;
    }

    for (let i of source.themes) {
        if (sourceThemeList[i.name] == targetThemeList[i.name]) {
            finalArray.push(target);
            return true;
        }
    }

    return false;
}

const searchSimilar = (source, target) => {


    if (target.authors[0] == source.authors[0]) {
        finalArray.push(target);

        return;
    }

    if (compareGenres(source, target) && true) {

        return;
    }

    compareThemes(source, target);

}

const createCache = async(id, source, similarList)=> {
    let cache = JSON.stringify({id: id, source: source, similarList: similarList});
        
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/application/json');
    let raw = await fetch('/search/cache/', {method: "POST", body: cache, headers: headers})
    
}

const compareData = async (source, target) => {
    let loadbar = document.querySelector('.load-bar');
    loadbar.style.width = `0%`;
    let increment = 100 / target.length;
    let headers = new Headers();
    headers.append('Cache-Control', 'public, max-age=60');
    for (let i = 0; i < target.length; i++) {
        await delay(100);
        let raw;
        try {

            let tempController = new AbortController();
            let timeoutId = setTimeout(()=> {tempController.abort()}, 10000)
            raw = await fetch(`https://api.jikan.moe/v3/manga/${target[i]}`, {signal: tempController.signal});
            clearTimeout(timeoutId);
        } catch (e) {
            loadbar.style.width = `${parseInt(loadbar.style.width)+increment}%`;
            console.log(e);
            continue;
        }
        if (!raw.ok) {
            continue;
        }

        let parsed = await raw.json();


        searchSimilar(source, parsed);
        loadbar.style.width = `${parseInt(loadbar.style.width)+increment}%`
    }
}

const createCarousel = (arr) => {
    let main = document.querySelector('main.container');
    let carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.remove();

    let newCarouselContainer = document.createElement('div');
    newCarouselContainer.classList.add('carousel-container');

    if(arr.length == 1) {
        
        let carouselImage = document.createElement('img');
        carouselImage.classList.add('carousel-image');
        
        carouselImage.classList.add('active');
        
        carouselImage.setAttribute("src", arr[0].image_url);
        carouselImage.setAttribute("data-name", arr[0].title);
        carouselImage.setAttribute("data-id", arr[0].mal_id);
        carouselImage.setAttribute("alt", arr[0].title);
        newCarouselContainer.append(carouselImage);
    }
    else {

        for (let i = 0; i < arr.length; i++) {
            let carouselImage = document.createElement('img');
            carouselImage.classList.add('carousel-image');
            if (i == 1) {
                carouselImage.classList.add('active');
            }
            carouselImage.setAttribute("src", arr[i].image_url);
            carouselImage.setAttribute("data-name", arr[i].title);
            carouselImage.setAttribute("data-id", arr[i].mal_id);
            carouselImage.setAttribute("alt", arr[i].title);
            newCarouselContainer.append(carouselImage);
    
        }
    }

    main.prepend(newCarouselContainer);
    return newCarouselContainer;
}

const createCachedCarousel = (obj) => {
    let main = document.querySelector('main.container');
    let carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.remove();

    let newCarouselContainer = document.createElement('div');
    newCarouselContainer.classList.add('carousel-container');
    let counter = 0;
    for (let i in obj) {
        
        let carouselImage = document.createElement('img');
        carouselImage.classList.add('carousel-image');
        if (counter == 1) {
            carouselImage.classList.add('active');
        }
        carouselImage.setAttribute("src", obj[i].image_url);
        carouselImage.setAttribute("data-name", obj[i].title);
        carouselImage.setAttribute("data-id", obj[i].mal_id);
        carouselImage.setAttribute("alt", obj[i].title);
        newCarouselContainer.append(carouselImage);
        counter++;
    }

    main.prepend(newCarouselContainer);
    return newCarouselContainer;
}

const loadCarousel = async (source, data) => {
    /* Check first */
    if(!checkList.cached){
        await compareData(source, data);
    
        let carouselContainer = await createCarousel(finalArray);
        return carouselContainer;
    }
    if(checkList.cached){
        let carouselContainer = await createCachedCarousel(checkList.data);
        return carouselContainer;
    }
}



const run = async () => {
    let carouselContainer = await loadCarousel(checkList.source, checkList.data);

    let images = carouselContainer.children;

    /* Set order */
    for (let i = 0; i < images.length; i++) {
        images[i].style.order = i;
    }

    let title = document.querySelector('.manga-title');

    /* Initialize Controls */
    await createListeners(images, title);

    /* Change similar title */
    let similartitle = document.querySelector('.similar-title');

    similartitle.innerText = checkList.source.title;
    similartitle.setAttribute('href', `/manga/${checkList.source.mal_id}`);

    /* Remove the curtain and reveal :D */
    await curtain.remove();
    for (let i of body.children) {
        i.removeAttribute('style');
    }

    if(!checkList.cached){
        let list = {};
        for(let i of finalArray) {
            list[i.mal_id] = i;
        }
        createCache(checkList.source.mal_id, checkList.source, list)
    }
    

}

run();







