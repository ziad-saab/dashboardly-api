//req.user an is being set in check-login-token.js
//binds req, res and next to it
module.exports = (req, res, next) => {
  //console.log("Current req.user =", req.user);
  if (req.user) {
    next();
  } else {
    res.status(401)
    .json({
      error: 'unauthorized-user'
    });
  }
};
