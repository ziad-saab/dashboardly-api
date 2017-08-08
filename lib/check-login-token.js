//dataLoader is being passed in index.js app.use(checkLoginToken(dataLoader));
//middleware that checks user has a login token
//binds req, res and next to it
module.exports = dataLoader => (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    dataLoader.getUserFromSession(token)
    .then(
      (user) => {
        if (user) {
          req.user = user;
          req.sessionToken = token;
        }
        next();
      }
    )
    .catch(
      (err) => {
        console.error('Something went wrong while checking Authorization header', err.stack);
        next();
      }
    );
  } else {
    next();
  }
};
