module.exports = dataLoader => (req, res, next) => {
  if (req.headers.authorization) {
    dataLoader.getUserFromSession(req.headers.authorization.split(' ')[1])
    .then(
      (user) => {
        if (user) {
          req.user = user;
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
