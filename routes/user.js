const express = require('express');
const { redirect } = require('express/lib/response');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const User = require('../models/user');
const asyncErrorHandler = require('../utils/AsyncErrorHandler');
const router = express.Router();



router.get('/register', (req,res) => {
    res.render('user/register');
})

router.post('/register', asyncErrorHandler(async(req,res, next) => {

    try{
        const user = new User(req.body.user);
        const newUsr = await User.register(user,req.body.password);
        req.login(newUsr, err => {
            if(err) return next(err);
            req.flash('success', "Welcome!");
            res.redirect('/login');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }

}));

router.get('/login', (req,res) => {
    res.render('user/login')
})

router.post('/login', passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login'}), asyncErrorHandler(async(req,res) => {
    
    req.flash('success', "Welcome back!");
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
}))

router.get('/logout', isLoggedIn ,(req,res) => {
    req.logOut();
    req.flash('success', "See you soon!")
    res.redirect('/');
})


module.exports = router;
