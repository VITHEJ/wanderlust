const express = require("express");
const router=express.Router();
const mongoose = require("mongoose");
const path=require('path');
const engine = require('ejs-mate');
const methodOverride = require("method-override");
const Listing=require('../models/listings.js');
const wrapasync=require('../utils/wrap.js');
const ExpressError=require('../utils/expressError.js');
const {ListingSchema,reviewSchema}=require('../schema.js');
const {isLoggedIn}=require('../middleware.js');
const {homeRoute,seacrhRoute,newRoute,createListing,individualRoute,updateRoute,editRoute,deleteRoute}=require('../controllers/listing.js');
const multer  = require('multer');
const {storage}=require('../cloudconfig.js');
const upload = multer({ storage });

const validate=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);
    if(error){
        let errorMessage=error.details.map(el=>el.message).join(',');
            throw new ExpressError(400,errorMessage);
    }
    
    }

//home route
router.get("/",wrapasync(homeRoute)
);
//new route
router.get('/new/add',isLoggedIn,newRoute)
//add
router.post('/add',upload.single('listing[image]'),wrapasync(createListing));
//search route
router.get('/search',wrapasync(seacrhRoute));


//get and update route
router.route("/:id")
.get(wrapasync(individualRoute)
)
.put(isLoggedIn,validate,wrapasync(updateRoute)
)

//edit route
router.get('/:id/edit',isLoggedIn,wrapasync(editRoute)
);

//delete route
router.get('/:id/delete',isLoggedIn,wrapasync(deleteRoute)
);
module.exports=router;