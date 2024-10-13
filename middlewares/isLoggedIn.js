const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl= req.originalUrl;
    req.flash("error", "You Must Be Logged In!");
    return res.redirect("/login");
  }
  next();
};
module.exports=isLoggedIn;

