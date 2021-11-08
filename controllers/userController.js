const User = require('../models/User');
const CustomError = require('../utils/customError');
const createRandomDecimal = require('../utils/randomDecimal');
const {sendVerifyLink} = require('../utils/sendVerifyLink');
const resetPass = require('../utils/resetPass');

const bcrypt = require('bcrypt');

module.exports.login = async(req, res)=> {
    
    res.render('loginpage/loginpage.ejs');
    
    
}

module.exports.postLogin = async(req, res, next)=> {
    /* Empty since passpourt wants to handle the login logic */
}

module.exports.postRegister = async(req, res, next)=> {
    try {
        let hostname = req.hostname;
        let {email, password} = req.body;
      
        if(!email.includes('@')){
            throw new CustomError('Invalid email address', 400);
        }

        if(password.length < 6){
            throw new CustomError('Password must be atleast 6 characters', 400);
        } else if (password.length > 32) {
            throw new CustomError("Password's max length is 32 characters", 400);
        }
        
        let verifyDecimal = createRandomDecimal(32);
        let user = await new User({email: email, username: email, verified: false, verifyDecimal});
        
        user.verifyLink = `/verify/${user._id}/${user.verifyDecimal}`;
       
        let registeredUser = await User.register(user, password);

        if(process.env.NODE_ENV !== 'production'){
            hostname = `${req.hostname}:3000`
         }

        await sendVerifyLink(registeredUser.verifyLink, registeredUser.email, hostname);

        await req.flash('success', "Successfully registered! Please verify your email via link sent on it");
        await req.login(registeredUser, (e)=> {
            if(e) {
                return next(e);
            }
            
            return res.redirect('/');
        });
        
    } catch (e) {
        await req.flash('error', e.message)
        return res.redirect('/register');
    }
}

module.exports.logOut = async(req, res, next)=> {
    try {
        req.logout();
        await req.flash('success', "Succesfully logged out!");
        return res.redirect('/');
    } catch (e) {
        await req.flash("error", e.message);
        res.redirect('/');
    }
    
}

module.exports.showProfile = async(req, res, next)=> {
    let user = await User.findById(req.user._id);
    return res.render('userprofile/userprofile.ejs', {user})
}

module.exports.verifyUser = async(req, res, next)=> {
    
    let {userid, decimalid} = req.params;
    let user = await User.findById(userid);
    
    if(user.verified){
        await req.flash('error', 'You are already verified!')
        return res.redirect('/');
    }
    if(user.verifyDecimal == decimalid) {
        user.verified = true;
        user.verifyLink = undefined;
        user.verifyDecimal = undefined;
        user.expiry = undefined;
        await user.save();
        await req.flash('success', 'You have been verified!')
        
        return res.redirect('/');
    }
    await req.flash('error', 'Invalid link!')
    return res.redirect('/');
    
}

module.exports.checkReset = async(req, res, next)=> {
    if(req.user){
        return res.redirect(`/reset/${req.user._id}`);
    }

    res.render('resetpage/resetmail.ejs')

}

module.exports.sendReset = async(req, res, next)=> {
    let {email} = req.body;
      

    let user = await User.findOne({email: email});
    
    if(!user){
        await req.flash('error', 'No user with that email exists');
        return res.redirect('/reset')
    }
    
    let hostname = req.hostname;

    if(process.env.NODE_ENV !== 'production'){
        hostname = `${req.hostname}:3000`
    }

    await resetPass(user, hostname)
    await req.flash('success', 'Sent an email with the reset link!')
    res.redirect('/reset');
    
}

module.exports.sendResetLoggedIn = async(req, res, next)=> {
    if(!req.user) {
        throw new CustomError('You must be logged in!', 400);
    }
    

    let user = await User.findById(req.user._id);

    let hostname = req.hostname;

    if(process.env.NODE_ENV !== 'production'){
        hostname = `${req.hostname}:3000`
     }

    await resetPass(user, hostname);
    await req.flash('success', 'Sent an email with the reset link!');
    return res.redirect('/');
}


module.exports.getReset = async(req, res, next)=> {
    let {id, resetid} = req.params;
    let info = {id, resetid};
    res.render('resetpage/resetpage.ejs', {info})
}

module.exports.postReset = async(req, res, next)=> {
    let {id, resetid} = req.params;
    
    let user = await User.findById(id);

    if(!user) {
        throw new CustomError("Couldn't find that user", 404);
    }
        
    if(!resetid == user.resetLink) {
        await req.flash('error', 'Invalid link!');
        return res.redirect('/');
    }

    let hrs = new Date().getHours().toString();
    
    let compare = await bcrypt.compare(hrs, user.resetHash);
    
    if(compare){

        let {password} = req.body;
        
        if(password.length < 6){
            throw new CustomError('Password must be atleast 6 characters', 400);
        } else if (password.length > 32) {
            throw new CustomError("Password's max length is 32 characters", 400);
        }

        user.resetLink = undefined;
        user.resetHash = undefined;

        await user.setPassword(password);
        await user.save();

        await req.flash('success', 'Succesfully reset password!');
        return res.redirect('/');
    } else {
        await req.flash('error', 'Link expired. Please generate a new one!')
        return res.redirect('/');
    }

    
}