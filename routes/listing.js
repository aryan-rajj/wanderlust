const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../Models/listing");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isOwner = require("../middlewares/isOwner.js");
const allListingRoute = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// all listing routes
router.get("/", asyncWrap(allListingRoute.allListings));
//add route
router
  .route("/new")
  .get(isLoggedIn, allListingRoute.addListingGet)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    allListingRoute.addListingPost
  );

router
  .route("/:id")
  .get(asyncWrap(allListingRoute.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    asyncWrap(allListingRoute.editListingPut)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(allListingRoute.deleteListing));
//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(allListingRoute.editListingGet)
);
module.exports = router;
