const Listing=require('../models/listings.js');
const Review=require('../models/review.js');

module.exports.postReview=async(req,res)=>{
let {id}=req.params;

let listing=await Listing.findById(id);
let review=new Review(req.body.review);
review.author=res.locals.currUser;
console.log(review);
listing.review.push(review);
await review.save();
await listing.save();
req.flash('success','Successfully made a new Review!');
console.log(review.author);
res.redirect(`/listings/${id}`);
}
module.exports.deleteReview=async(req,res)=>{
  let {id,reviewId}=req.params;
  
  let review=await Review.findById(reviewId);
  if(!review.author._id.equals(req.user._id)){
    req.flash('error','You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }else{
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Successfully deleted Review!');
  res.redirect(`/listings/${id}`);
  }
  
};