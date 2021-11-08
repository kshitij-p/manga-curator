const alreadyLogged = async(req, res, next)=> {
    if(!req.isAuthenticated()) {
        return next();
    }
    else {
        await req.flash('error', 'You are already registered/logged in!');
        return res.redirect('/');
    }
}

module.exports = alreadyLogged;