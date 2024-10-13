const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const app = express();
const methodOverride = require("method-override");
const port = 8080;
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/User.js");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// const listingSchema=require("./validateSchema.js");
// const reviewSchema=require("./validateSchema.js");
// app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "./public")));

app.engine("ejs", ejsMate);
//database se connection
// let MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
let dbUrl = process.env.ATLAS_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connected to mongo");
  })
  .catch((err) => console.log(err));

//function
// const validateSchema=(req,res,next)=>{
//     let {err}=listingSchema.validate(req.body);
//     if(err){
//         throw new ExpressError(400,err);
//     }
//     else{
//         next();
//     }
// };
// const validateReview=(req,res,next)=>{
//     let result=reviewSchema.validate(req.body);
//     console.log(result);
//     if(err){
//         throw new ExpressError(400,err);
//     }
//     else{
//         next();
//     }
// };

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", () => {
  console.log("error in mongo session", err);
});
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(cookieParser("abcd"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         username:"fake-user",
//         email:"fake_user@gmail.com",
//     });
//     let registeredFakeUser= await User.register(fakeUser,"Hello-World");
//     res.send(registeredFakeUser);
// })

//middlewares
app.use((req, res, next) => {
  res.locals.msg = req.flash("success");
  res.locals.err = req.flash("error");
  res.locals.currUser = req.user;
  console.log(req.user);
  next();
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use((err, req, res, next) => {
  console.log(err.name);
  next(err);
});
//end
app.all("*", (err, req, next) => {
  // next(err);
  next(new ExpressError(404, "Not a route"));
});
app.use((err, req, res, next) => {
  let {
    status = 500,
    message = "Not Working Try Again Later",
    name = "MKC",
  } = err;
  res.render("./listings/err.ejs", { status, message, name });
});
app.listen(port, () => {
  console.log("listening on port 8080");
});
