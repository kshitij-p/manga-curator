const hamburgerIcon = document.querySelector('.menu');

const expandedMenu = document.querySelector('.expanded-menu')

hamburgerIcon.addEventListener('click', ()=> {
    expandedMenu.classList.remove('hidden')
})

document.addEventListener('click', ({target})=> {
    

    if(target == hamburgerIcon.children[0]){
        
        return;
    }

    if (!expandedMenu.classList.contains('hidden')){
        
        
        if(!expandedMenu.contains(target)){
            expandedMenu.classList.add('hidden');
        }
    }
})