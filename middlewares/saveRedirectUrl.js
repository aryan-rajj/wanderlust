const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    console.log(req.session.redirectUrl);
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports = saveRedirectUrl;
