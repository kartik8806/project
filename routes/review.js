const express = require('express');
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview,isLoggedIn,isReviewAuthor  } = require("../middleware.js");

const reviewcontroller = require("../controllers/reviews.js");




// Reviews
// post route

router.post('/', 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewcontroller.createReview));
// delete route for review
router.delete("/:reviewId",
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(reviewcontroller.deleteReview))

module.exports = router;
