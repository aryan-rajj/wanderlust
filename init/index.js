const mongoose = require('mongoose');
const Listing=require('../Models/listing.js');
const initData = require("./data.js");

//database se connection
let MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
async function main() {
  await mongoose.connect(MONGO_URL);
}
main().then(()=>{
console.log("Connected to mongo");
})
.catch(err => console.log(err));

const initDB= async()=>{
    await Listing.deleteMany({ });
    initData.data=initData.data.map((obj)=>({...obj,owner:"67058fadefe4044475a22611"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized")
}
initDB();