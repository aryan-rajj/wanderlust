const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js")
const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."], // Custom error message if title is missing
    minlength: [1, "Title cannot be empty."], // Ensures the title is not an empty string
  },
  description: {
    type: String,
    required: [true, "Description is required."], // Custom error message for description
    minlength: [10, "Description must be at least 10 characters long."], // Minimum length for description
  },
  image: {
    url:String,
    filename:String,
  },
  price: {
    type: Number,
    required: [true, "Price is required."], // Custom error message for price
    min: [0, "Price must be greater than or equal to 0."], // Validation for price
  },
  location: {
    type: String,
    required: [true, "Location is required."], // Custom error message for location
  },
  country: {
    type: String,
    default: "Unknown",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    let res=await Review.deleteMany({_id:{$in:listing.reviews}});
    console.log(res);
  }
})

// Export the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
