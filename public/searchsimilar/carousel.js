
const createListeners = async(images, title)=> {
    
    let active, right, left;
    /* Loop through to find the active image */
    for (let i =0; i < images.length; i++){
        if (images[i].classList.value.includes('active')){
            active = i;
            right = i+1;
            left = i-1;
            
            if(active == images.length-1){
                right = 0;
            }

            if(active == 0){
                left = images.length-1;
            }
           
            break;
        }
        
    }

    
    
    /* Helper variables */
    rightImage = images[right];
    activeImage = images[active];
    leftImage = images[left];

    /* Set the title using the active image's data-name attribute */
    getName(activeImage, title);
    
    /* Add click even to the right image */
    rightImage.addEventListener('click', ({target})=> {

       createRight(images, leftImage, activeImage, rightImage, target, title);
    })

    /* Add click even to the left image */
    leftImage.addEventListener('click', ({target})=> {

        createLeft(images, leftImage, activeImage, rightImage, target, title);

    })
    
    activeImage.addEventListener('dblclick', ({target})=> {
        if(!activeImage.contains(target)){
            return;
        }

        window.open(`/manga/${activeImage.getAttribute('data-id')}`, 'blank').focus();
    })

}


const createRight = (images, leftImage, activeImage, rightImage, target, title)=> {
     /* Check for bubbling */
     if(!rightImage.contains(target)){
            
        return;
    }

    /* Reduce the order by 1 and if the image's order is 0, set it to last position */
    for(let i =0; i< images.length;i++){
        if(images[i].style.order == 0){
            images[i].style.order = images.length-1;
        } else {
            images[i].style.order = parseInt(images[i].style.order) - 1;
        }
        
    }

    /* Change image status */
    activeImage.classList.remove('active');
    rightImage.classList.add('active');
    
    createListeners(images, title);
}

const createLeft = (images, leftImage, activeImage, rightImage, target, title)=> {
    if(!leftImage.contains(target)){
            
        return;
    }

    /* Increase the order by 1 and if the image's order is the last pos, set it to the first i.e. 0 in this case */
    for(let i =0;i<images.length;i++){
        if(images[i].style.order == images.length-1){
            images[i].style.order = 0;
        } else {
            images[i].style.order = parseInt(images[i].style.order) + 1;
        }
        
    }

    activeImage.classList.remove('active');
    leftImage.classList.add('active');

    
    createListeners(images, title);
}