const express = require('express');
const userRouter = express.Router();
const isLogged = require('../utils/isLogged');
const alreadyLogged = require('../utils/alreadyLogged');
const passport = require('passport');

const catchAsync = require('../utils/catchAsync.js');
const userController = require('../controllers/userController');
const sanitizeRequest = require('../utils/sanitizeRequest');

userRouter.route('/login')
    .get(alreadyLogged, catchAsync(userController.login))
    .post(alreadyLogged, sanitizeRequest, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', 
    successFlash: 'Successfully logged in', successRedirect: '/'}), catchAsync(userController.postLogin) )
    
userRouter.route('/register')
    .get(alreadyLogged, async(req, res)=> {
        res.render('registerpage/registerpage.ejs')
    })
    .post(alreadyLogged, sanitizeRequest, catchAsync(userController.postRegister))


userRouter.get('/logout', isLogged, catchAsync(userController.logOut));

userRouter.get('/profile', isLogged, catchAsync(userController.showProfile));

userRouter.get('/verify/:userid/:decimalid', catchAsync(userController.verifyUser))

userRouter.get('/reset', catchAsync(userController.checkReset))

userRouter.post('/reset/mail', sanitizeRequest, catchAsync(userController.sendReset));

userRouter.get('/reset/:id', isLogged, catchAsync(userController.sendResetLoggedIn))

userRouter.get('/reset/:id/:resetid', catchAsync(userController.getReset))
userRouter.post('/reset/:id/:resetid', sanitizeRequest, catchAsync(userController.postReset));

module.exports = userRouter;