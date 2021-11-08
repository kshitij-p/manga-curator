

const validateSubmit = async(submitQuery, inputList = null, 
    queries = {emailQuery: null, passQuery: null})=> {
    
    let submit = document.querySelector(submitQuery);
    let inputs, email, pass;
    
    if(inputList.length) {
        inputs = inputList;
    }
    else {
        let {emailQuery, passQuery} = queries;
        email = await document.querySelector(emailQuery);
        pass = await document.querySelector(passQuery)
        inputs = [email, pass];
    }
    
    let isValid = (inputs)=> {
        
        for(let i=0;i<inputs.length;i++){
            if(!inputs[i]){
                continue;
            }

            if (!inputs[i].checkValidity()){
                                
                return false;
            }
        }

        return true;
    }

    submit.addEventListener('click', (e)=> {
        if(!isValid(inputs)) {
            e.preventDefault();
        }
    })
    
}

