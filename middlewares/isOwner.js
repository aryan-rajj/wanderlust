const Listing = require("../Models/listing");

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "not your owned listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports=isOwner;
