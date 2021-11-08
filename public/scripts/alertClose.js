const closeAlert = (alert)=> {
    
    alert.addEventListener('click', (e)=> {
        
        
        alert.parentElement.remove();
    })
    
}

let alertbutton = document.querySelector('.alert-close');
if(alertbutton) closeAlert(alertbutton);
