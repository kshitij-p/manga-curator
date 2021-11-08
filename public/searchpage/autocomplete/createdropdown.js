//root is a html DOM object to which the auto complete will append to
//data accepts an object that has a getter function that should return data from an api or whatever source
//data.arrayname should be a string that holds the name of the key under which the list of that needs to be displayed contains
const createDropDown = async ({root, getter = {getter: undefined, arrayName: ''},
                                  renderOptions = {image: false, titleName: '', imageName: '', 
                                  customLink: false, linkName: ''}})=> {
    
    root.classList.add('autocomplete-inline')
    let input = createInput();
    let dropcontainer = createContainer();
    
       
    
                                
    await root.append(input, dropcontainer);
    createInputListener(input, dropcontainer, renderOptions, getter)
    
    hideMenu(dropcontainer);  //adds event listener to hide menu

    
}



