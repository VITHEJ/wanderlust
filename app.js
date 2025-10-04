if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require('path');
const engine = require('ejs-mate');
const methodOverride = require("method-override");
const listingRoutes=require('./router/listing.js');
const reviewRoutes=require('./router/reviews.js');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const dbUrl=process.env.ATLASDB_URL;
const userRoutes=require('./router/users.js');
mongoose.connect(dbUrl)
  .then(() => console.log('Connected!'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',engine);
app.use(express.static(path.join(__dirname,'/public')));
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60
});
store.on('error',()=>{
console.log('session store error');
});
const sessionOptions={
   store, 
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now+7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();    
})
app.use('/listings',listingRoutes);
app.use('/listings/:id/review',reviewRoutes);
app.use('/',userRoutes);
//middlware
app.use((err,req,res,next)=>{
 let {statusCode=500,message='Something Wnt Wrong'}=err;
res.render("./listings/error.ejs",{err});
});
app.listen(8080,()=>{
    console.log('listening to the port');
})
