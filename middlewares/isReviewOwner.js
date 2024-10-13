const Review = require("../Models/review");

const isReviewOwner = async (req, res, next) => {
  const { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "not your owned review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports=isReviewOwner;