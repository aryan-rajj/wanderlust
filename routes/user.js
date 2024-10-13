const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../Models/User.js");
const passport = require("passport");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl.js");
const allUsers = require("../controllers/users.js");
//signup get
//router route
router
  .route("/signup")
  .get(allUsers.userSignupGet)
  .post(asyncWrap(allUsers.userSignupPost));

//login get
router
  .route("/login")
  .get(allUsers.userLoginGet)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    asyncWrap(allUsers.userLoginPost)
  );
//logout
router.get("/logout", allUsers.userLogout);

module.exports = router;
