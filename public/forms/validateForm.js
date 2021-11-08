
const validateInput = (input) => {


    let validationId;
    let validationList = {};

    const delayedInput = (email, delay, label) => {
        if (validationId) {
            clearTimeout(validationId);
        }
        validationId = setTimeout(() => {
            isValid(email, label);
        }, delay);
    }

    const isValid = (input, label) => {
        input.setCustomValidity('');
        if (input.checkValidity()) {
            input.style.borderColor = null;
            if (label && label.children.length) {
                removeSymbol(label);
            }

        }
        else {
            input.style.borderColor = "hsl(21, 100%, 84%)";
            validationList[input.id || input.classList] = 1;

            if(input.validity.tooShort){
                input.setCustomValidity("must be 6 min. characters")
            }
            if(input.validity.tooLong){
                input.setCustomValidity("max length is 64 characters")
            }
            if(input.getAttribute('type')==='email') {
                input.setCustomValidity('invalid email')
            }
            if (label && !label.children.length) {

                addSymbol(label);

            }
        }
    }


    validationList[input.id || input.classList] = 0;
    let label = document.querySelector(`label[for=${input.id}]`);

    input.addEventListener('input', () => {
        if (!validationList[input.id || input.classList]) {

            delayedInput(input, 1000, label);
        }
        if (validationList[input.id || input.classList]) {

            delayedInput(input, 250, label);
        }
    })

    input.addEventListener('invalid', () => {
        input.style.borderColor = "hsl(21, 100%, 84%)";
       
    })
}


const addSymbol = (label) => {
    let infotag = document.createElement('b');
    infotag.classList.add('info-tag');
    infotag.style.color = 'hsl(21, 60%, 84%)';
    infotag.innerText = "ⓘ"
    infotag.style.textShadow = '';

    

    let infomsg = document.createElement('b');
    infomsg.classList.add('info-tag-message');
    infomsg.classList.add('hidden');
    let input = document.querySelector(`#${label.getAttribute('for')}`);
    infomsg.innerText = input.validationMessage;

    infotag.addEventListener('mouseenter', ()=> {
        infomsg.classList.remove('hidden');
    })

    infotag.addEventListener('mouseleave', ()=> {
        infomsg.classList.add('hidden');
    })

    infotag.addEventListener('click', ()=> {
        infomsg.classList.toggle('hidden');
    })

    label.append(infotag)
    label.append(infomsg)
    
    
}

const removeSymbol = async(label) => {
    

   while(label.children.length > 0){
       label.children[0].remove();
   }
}

const createValidations = (arr) => {
    for (let i of arr) {
        validateInput(i);
    }
}

let inputList = document.querySelectorAll('.form-input');
validateSubmit('.cta-button', inputList);
createValidations(inputList);

