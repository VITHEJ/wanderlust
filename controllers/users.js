const User=require('../models/user.js');

module.exports.signup=async(req,res)=>{
res.render('./users/signup.ejs');
};
module.exports.postSignup=async(req,res)=>{
    let {username,email,password}=req.body;
    try{
        let user=new User({username,email});
        let registeredUser=await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to WanderLust');
            res.redirect('/listings');
        })
        
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }

};
module.exports.getLogin=(req,res)=>{
    res.render('./users/login.ejs');
};
module.exports.login=async(req,res)=>{
    req.flash('success',"Welcome to WanderLust");
    let url=res.locals.redirect||"/listings";
    res.redirect(url);
    
};
module.exports.logout=(req,res,next)=>{
 req.logout((err)=>{
    if(err){
    return next(err);
    }
    req.flash("success","You were Logged out Successfully!")
    res.redirect('/listings');
 })
}
