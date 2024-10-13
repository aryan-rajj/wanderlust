const Listing = require("../Models/listing");
require("dotenv").config();
const mapApiKey = process.env.MAP_BOX_API;
const geoCode=require("../utils/location.js")
module.exports.allListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};
module.exports.addListingGet = (req, res) => {
  res.render("./listings/addnew.ejs");
};
module.exports.addListingPost = async (req, res) => {
  // const result= listingSchema.validate(req.body);
  // if(result.error){
  //     throw new ExpressError(400,result.error);
  // }
  const newListing = new Listing(req.body.listing);
  let address=newListing.location;
  // console.log(geoCode(address));
  newListing.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image = { url, filename };
  let data = await newListing.save();
  console.log(data);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "No Listing Found!!");
    res.redirect("/listings");
    //   throw new ExpressError(401, "Page Not Found");
  }
  console.log(mapApiKey);
  res.render("./listings/show.ejs", { listing, mapApiKey });
};
module.exports.editListingGet = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "not your owned listing");
    return res.redirect(`listings/${id}`);
  }
  if (!listing) {
    req.flash("error", "No Listing Found!!");
    res.redirect("/listings");
    //   throw new ExpressError(401, "Page Not Found");
  }
  res.render("./listings/update.ejs", { listing, originalImageUrl });
};
module.exports.editListingPut = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    let data = await listing.save();
    console.log(data);
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
