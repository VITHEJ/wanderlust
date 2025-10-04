
const Listing=require('../models/listings.js');


module.exports.homeRoute=async(req,res)=>{
  let allListings=await Listing.find();
  res.render('./listings/listings.ejs',{allListings});
};
module.exports.seacrhRoute=async(req,res)=>{
let {country_search}=req.query;
console.log(country_search);
const listings=await Listing.find({country:country_search});
res.render("./listings/listings.ejs",{allListings:listings});

};

module.exports.newRoute=async(req,res)=>{
  res.render('./listings/form.ejs');
};
module.exports.createListing=async(req,res)=>{

let {path:url,filename}=req.file;
  let listing=new Listing(req.body.listing);
  listing.owner=req.user._id;
  listing.image.url=url;
  listing.image.filename=filename;
    await listing.save();
    req.flash('success','Successfully made a new listing!');
res.redirect('/listings');
};
module.exports.individualRoute=async(req,res)=>{
  
  let {id}=req.params;
  let list=await Listing.findById(id).
  populate({path:'review',
    populate:{
    path:'author'
  }});
  if(!list){
    req.flash('error','Cannot find that listing!');
    res.redirect('/listings');
    }  else{
  console.log(list);
  res.render('./listings/list.ejs',{list});
    }
};
module.exports.updateRoute=async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,'invalid form data');}
  let {id}=req.params;
  let list=await Listing.findById(id);
   if(!list.owner._id.equals(res.locals.currUser._id)){
    req.flash('error','You do not have permission to do that!');
    res.redirect(`/listings/${id}`);
  }else{
    console.log({...req.body.Listing});
     let listing= await Listing.findByIdtAndUpdate(id,{...req.body.listing});
     if(typeof req.file!='undefined'){
      listing.image.url=req.file.path;
      listing.image.filename=req.file.filename;
    await listing.save();
     }
      req.flash('success','Listing Updated!');
  res.redirect(`/listings/${id}`);
  }
  
};
module.exports.editRoute=async(req,res)=>{
  let {id}=req.params;
  const list= await Listing.findById(id);
  if(!list.owner._id.equals(res.locals.currUser._id)){
    req.flash('error','You do not have permission to do that!');
    res.redirect(`/listings/${id}`);
  }else{
      if(!list){
    req.flash('error','Cannot find that listing!');
    res.redirect('/listings');
    }  else{
      let {original}=list.image.url;
      console.log(original);
      
      res.render("./listings/edit.ejs",{list});
    }

  }

  
};
module.exports.deleteRoute=async(req,res)=>{
  let {id}=req.params;
   let list =await Listing.findById(id);
     if(!list.owner._id.equals(res.locals.currUser._id)){
    req.flash('error','You do not have permission to do that!');
    res.redirect(`/listings/${id}`);
  }else{
    await Listing.findByIdAndDelete(id);
  req.flash('success','Listing Deleted!');
  res.redirect('/listings');
  }
};