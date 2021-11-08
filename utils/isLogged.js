const isLogged = async(req, res, next)=> {
    if(req.isAuthenticated()) {
        return next();
    }
    else {
        await req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/');
    }
}

module.exports = isLogged;