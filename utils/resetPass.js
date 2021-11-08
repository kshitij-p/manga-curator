const {sendresetLink} = require('./sendVerifyLink');
const bcrypt = require('bcrypt');

const resetPass = async(user, hostname)=> {
    let time = new Date().getHours().toString();
    
    let hash = await bcrypt.hash(time, 10);
    
    while(hash.includes('/')){
        
        hash = await bcrypt.hash(time, 10);
              
    
    }
       
    
    
    user.resetLink = `/reset/${user._id}/${hash}`;
    user.resetHash = hash;
    await user.save();
    

    await sendresetLink(user.resetLink, user.email, hostname);
}

module.exports = resetPass;