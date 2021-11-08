
const getData = async(query)=> {
    
    let raw = await fetch(`https://api.jikan.moe/v3/search/manga?q=${query}&limit=5`);
    
    //check for response
    if(!raw.ok){
        throw new Error;
    }

    let data = await raw.json();
    
    return data;
}

let input = document.querySelector('div.autocomplete');


const options =  {root: input, getter: {getter: getData, arrayName: 'results'},
                  renderOptions: {image: true, titleName: 'title', imageName: 'image_url', 
                  customLink: true, linkName: '/manga/'}}

createDropDown(options);

