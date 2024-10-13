const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../Models/listing");
const Review = require("../Models/review.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isReviewOwner = require("../middlewares/isReviewOwner.js");
const allReviews = require("../controllers/reviews.js");
//post
router.post("/", isLoggedIn, asyncWrap(allReviews.reviewPost));
//delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  asyncWrap(allReviews.reviewDelete)
);
module.exports = router;