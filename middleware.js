const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res,next )=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!")
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log( res.locals.redirectUrl); 
    }
    next();
}

module.exports.isOwner = async (req,res, next)=>{
    let{id} = req.params;
    let listing =  await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you are not owner of the listings");
        return res.redirect(`/listings/${id}`);
    }next();


   
}
// client side validation for listing schema
module.exports.validateListing  = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400, error);
    } else{
        next();
    }

};

// client side validation for review schema
module.exports.validateReview  = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400, error);
    } else{
        next();
    }

};
// Owner aouthorization

module.exports.isReviewAuthor = async (req,res, next)=>{
    let{id,reviewId} = req.params;
    let review =  await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not author of the listings");
        return res.redirect(`/listings/${id}`);
    }next();
}