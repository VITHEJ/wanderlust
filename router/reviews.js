const express = require("express");
const router=express.Router({mergeParams:true});
const mongoose = require("mongoose");
const path=require('path');
const engine = require('ejs-mate');
const methodOverride = require("method-override");
const Listing=require('../models/listings.js');
const wrapasync=require('../utils/wrap.js');
const ExpressError=require('../utils/expressError.js');
const {ListingSchema,reviewSchema}=require('../schema.js');
const Review=require('../models/review.js');
const {isLoggedIn}=require('../middleware.js');
const {saveRedirectUrl}=require('../middleware.js');
const {postReview,deleteReview}=require('../controllers/review.js');

const validateReview=(err,req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
if(error){
  let errorMessage=error.details.map(el=>el.message).join(',');
      throw new ExpressError(400,errorMessage);
}
}

//post route for 

router.post('/',isLoggedIn,validateReview,wrapasync(postReview));
//delete review
router.delete('/:reviewId',wrapasync(deleteReview));
  
module.exports=router;