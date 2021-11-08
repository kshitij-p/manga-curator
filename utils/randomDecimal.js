const createRandomDecimal = (size)=> {
    let x = Array(size);
    let list = {10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F"};

    let random = [...x].map((x)=> {
        let temp = Math.floor(Math.random() * 16);
        
        if(temp > 9){
            temp = list[temp];
        }
        return temp;
    })
    
    let result = random.join('').toString();
    
    return result;
}

module.exports = createRandomDecimal;