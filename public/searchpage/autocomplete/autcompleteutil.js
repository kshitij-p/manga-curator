//delays function until you stop typing
const waitForTypingEnd = (func, delay = 1000)=> {
    let timeoutID;
    return function(...arg) {
        if(timeoutID) {
            clearTimeout(timeoutID);
        }

        timeoutID = setTimeout(()=>{func.apply(null, arg)}, delay)

    }
}

const fetchData = async(func, arrayName, query)=> {
    try {

    
    let data = await func(query);
    return data[arrayName];
    }
    catch (e) {
        //do stuff
        return [];
    }
}


const hideMenu = (container)=>{
    document.addEventListener('click', ({target})=> {
              
       
        if(!container.parentElement.contains(target)){
            
            container.classList.remove('is-active');
        }
    })
}

const emptyRows = async(container)=> {
    try {
        let menu = await getMenu(container);
        
        await menu.remove();
        
        await createMenu(container);
    }catch (e) {
        
    }
    
}


const createInput = ()=> {
    let input = document.createElement('input');
    input.classList.add('autocomplete-input')
    input.classList.add('search-bar')
    return input;
}

const createContainer = ()=> {
    let container = document.createElement('div');
    
    container.classList.add('dropdown-container')
    
    container.innerHTML = `
    <div class="dropdown-menu"></div>
    `
    
    return container;
}

const createMenu = (container)=> {
    menu = document.createElement('div');
    menu.classList.add('dropdown-menu');
    container.append(menu);
}

const createRows = waitForTypingEnd(async (container, renderOptions, input, getter)=> {
        if(!input.value){
            await emptyRows(container);
            return;
        }
        
        let data = await fetchData(getter.getter, getter.arrayName, input.value);
        
        if(!data) return;
       

        let menu = await getMenu(container);
        

        if(menu.children.length){
            
            await emptyRows(container);
            menu = await getMenu(container);
        }

        
        //if image is off we dont render image
        if(renderOptions.image == false) {
            //if custom link = false we look up the name provided as a key inside our data
            if(renderOptions.customLink == false){
           

                for(let i of data){
                    let entry = document.createElement('div');
                    await entry.classList.add('dropdown-result');
                    entry.innerHTML = `<span>
                    <a href="${i[renderOptions.linkName]}" class="dropdown-result-link">${i[renderOptions.titleName]}
                    </a></span>`
                    
                    
                    menu.append(entry);
                }
                //if custom link = true we use linkname as the link rather than the key
            } else {
                for(let i of data){
                    let entry = document.createElement('div');
                    entry.classList.add('dropdown-result');
                    entry.innerHTML = `<span>
                    <a href="${renderOptions.linkName}" class="dropdown-result-link">${i[renderOptions.titleName]}
                    </a></span>`
                    
                    await menu.append(entry);
                }
            }
        }
        else {
            //if custom link = false we look up the name provided as a key inside our data
            if(renderOptions.customLink == false){

            
                for(let i of data){
                    let entry = document.createElement('div');
                    entry.classList.add('dropdown-result');

                    if(!i[renderOptions.imageName]){
                        entry.innerHTML = `
                        <span>
                        <img src="" class="dropdown-result-img"><a href="${i[renderOptions.linkName]}" class="dropdown-result-link">${i[renderOptions.titleName]}
                        </a></span>`
                    } else {
                        entry.innerHTML = `
                        <span>
                        <img src="${i[renderOptions.imageName]}" class="dropdown-result-img"><a href="${i[renderOptions.linkName]}" class="dropdown-result-link">${i[renderOptions.titleName]}
                        </a></span>`
                    }
                    
                    await menu.append(entry);
                    
                }
            //if custom link = true we use linkname as the link rather than the key
            } else {
                for(let i of data){
                    let entry = document.createElement('div');
                    entry.classList.add('dropdown-result');

                    if(!i[renderOptions.imageName]){
                        entry.innerHTML = `
                        <span>
                        <img src="" class="dropdown-result-img"><a href="${renderOptions.linkName}" class="dropdown-result-link">${i[renderOptions.titleName]}
                        </a></span>`
                    } else {
                        entry.innerHTML = `
                        <span>
                        <img src="${i[renderOptions.imageName]}" class="dropdown-result-img"><a href="${renderOptions.linkName}${i.mal_id}" class="dropdown-result-link">${i[renderOptions.titleName]}
                        </a></span>`
                    }
                    
                    await menu.append(entry);
                }
            }
            
        }

        container.classList.add('is-active');
        
    
})

const createInputListener = (input, dropcontainer, renderOptions, getter)=> {
    input.addEventListener('input', ()=> {
        createRows(dropcontainer, renderOptions, input, getter);
    })

    input.addEventListener('click', ({target})=> {
        if(target == input && dropcontainer.children.length){
            dropcontainer.classList.add('is-active');
        }
    })

    input.addEventListener('keyup', ({code})=>{
        if(code == "Enter") {
            if(input.value){
                window.location.href += `/list/${input.value}`;
            }
        }
    })
}

const getMenu = async(container)=> {
    let menuList = document.querySelectorAll('div.dropdown-menu');
    
    
    
    for(let i =0;i<menuList.length;i++){
        if(container.contains(menuList[i])){
            let menu = menuList[i];
            return menu;
        }
    }

}


