const User = require("../Models/User.js");

module.exports.userSignupGet = (req, res) => {
  res.render("./users/signUp.ejs");
};
module.exports.userSignupPost = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User-Registered-Successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signUp");
  }
};
module.exports.userLoginGet = (req, res) => {
  res.render("users/logIn.ejs");
};
module.exports.userLoginPost = async (req, res) => {
  req.flash("success", "Welcome Back To WanderLust!! You are logged in");
  const redirectUrl = res.locals.redirectUrl || "/listings"; // Default to home page if redirectUrl is undefined
  res.redirect(redirectUrl);
};
module.exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (!err) {
      req.flash("success", "successfullt loggedOut!");
      res.redirect("/listings");
    } else {
      next(err);
    }
  });
};
