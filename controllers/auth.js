const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const authController = express.Router();

  // Create a new user (signup)
  authController.post('/users', (req, res) => {
    dataLoader.createUser({
      email: req.body.email,
      password: req.body.password,
      avatarUrl: req.body.avatarUrl
    })
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json(err));
  });


  // Create a new session (login)
  authController.post('/sessions', (req, res) => {
    //taking the input email and password as parameters
    //createTokenFromCredentials returns the new sessionToken on success
    dataLoader.createTokenFromCredentials(req.body.email, req.body.password)
    .then(token => {
      //TODO: Ask prof if doing this manually is the right way to do it
      req.headers.authorization = "token " + token;
      return token;
    })
    .then(token => res.status(201).json({ token: token }))
    //Above Sends a JSON response composed of a stringified version of the specified data
    //And the req.headers gets something like token sdfkjsdnvskdjf
    //This can used like below. See check-login-token.js
    //const token = req.headers.authorization.split(' ')[1];
    .then(()=>{console.log("req.headers from login post= ", req.headers)})
    .catch(err => res.status(401).json(err));
  });


  // Delete a session (logout)
  authController.delete('/sessions', onlyLoggedIn, (req, res) => {
    if (req.sessionToken === req.body.token) {
      dataLoader.deleteToken(req.body.token)
        .then(() => res.status(204).end())
        .catch(err => res.status(400).json(err));
    } else {
      res.status(401).json({ error: 'Invalid session token' });
    }
  });


  // Retrieve current user
  authController.get('/me', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
    res.status(500).json({ error: 'not implemented' });
  });

  return authController;
};
