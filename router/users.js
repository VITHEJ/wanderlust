const express = require("express");
const router=express.Router();
const User=require('../models/user.js');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
//const currPath=require("../middleware.js");
const {saveRedirectUrl}=require('../middleware.js');
const {signup,postSignup,getLogin,login,logout}=require('../controllers/users.js');
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const sessionOptions={
    secret:"thisshould",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now+7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    }
}
router.use(session(sessionOptions));
router.use(flash());
router
.route('/signup')
.get(signup)
.post(postSignup)

router
.route('/login')
.get(getLogin)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),login)


//log out
router.get('/logout',logout);

module.exports=router;