
const fitText = async(container, text)=> {
    let cwidth = container.offsetWidth;
    
    
    while(cwidth < text.offsetWidth){
        text.style.fontSize = `${parseInt(text.style.fontSize)/2 || 48}px`
        
    }
}


const copyText = async(array, text)=> {
    for(let i in array){
        array.fontSize = text.fontSize;
    }
}