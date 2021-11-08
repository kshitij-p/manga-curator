const body = document.querySelector('body');

const page2 = document.querySelector('.page-2')
const delayed = document.querySelectorAll('.fade-delayed');

const targets = document.querySelectorAll('.fade-in');

for(let i =0;i<targets.length;i++){
    targets[i].style.animationDelay = `${1 + i*0.25}s`
    
}

const fadeElements = ()=> {
    for(let i=0;i<delayed.length;i++){
        delayed[i].style.transition = '0.25s';
        setTimeout(()=> {
            delayed[i].style.opacity = 1;
        }, 100 + i*100)
    }
}

const observer = new IntersectionObserver((entries, observer)=> {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            fadeElements();
            observer.unobserve(page2);
        }
    })
}, {threshold: 0.25})

observer.observe(page2);