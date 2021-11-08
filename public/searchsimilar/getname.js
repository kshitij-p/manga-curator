const getName = (newActive, title)=> {
    title.innerText = newActive.getAttribute('data-name');
    title.setAttribute('href', `/manga/${newActive.getAttribute('data-id')}`)
}

const delay = (delayTime)=> {
    return new Promise((resolve)=> {
        setTimeout(()=> {
            resolve('');
        }, 2000)
    })
}