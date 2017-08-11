const express = require('express');
var md5 = require('js-md5');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const authController = express.Router();

  // Create a new user (signup)
  authController.post('/users', (req, res) => {

    // Hash email
    var hash = md5(req.body.email);

    dataLoader.createUser({
      email: req.body.email,
      password: req.body.password,
      avatarUrl: `https://www.gravatar.com/avatar/${hash}?s=60`
    })
    .then(user => {
      console.log(user[0]);
      var objUser ={
        id: user[0].id,
        email: user[0].email,
        avatarUrl: user[0].avatarUrl,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt
      };
      console.log('my object', objUser);
      //res.header('Access-Control-Allow-Origin', '*');
      //res.header('Access-Control-Request-Headers', 'Content-Type, Authorization');
      res.status(201).json(objUser);

    })
    .catch(err => res.status(401).json({error: err.message}));
  });

  // Create a new session (login)
  authController.post('/sessions', (req, res) => {
    //No need to use cookies or headers
    //a token will be sent a json object
    //AND will stored on a localStorage object provided by react/browser/front-end
    dataLoader.createTokenFromCredentials(req.body.email, req.body.password)
    .then(token => {
      return token;
    })
    .then(token => {
      res.status(201).json({ token: token })
    })
    //.catch(err => res.send(err.message));
    .catch(err => res.status(401).json({error: err.message}));
  });


  // Delete a session (logout)
  authController.delete('/sessions', onlyLoggedIn, (req, res) => {
    console.log("req.sessionToken= ", req.sessionToken);
    if (req.sessionToken) {
      dataLoader.deleteToken(req.sessionToken)
        .then(() => res.status(204).end())
        .catch(err => res.status(400).json(err));
    } else {
      res.status(401).json({ error: 'Invalid session token' });
    }
  });


  // Retrieve current user
  authController.get('/me', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
    //console.log("Headers ",req.headers);
    //console.log("Authorization = ",req.headers.authorization.split(' ')[1]);
    //dataLoader.getUserFromSession(req.headers.authorization.split(' ')[1])
    dataLoader.getUserFromSession(req.sessionToken)
      .then(user => {
        console.log(user[0]);
        var objUser = {
          id: user[0].users_id,
          email: user[0].users_email,
          avatarUrl: user[0].users_avatarUrl,
          createdAt: user[0].users_createdAt,
          updatedAt: user[0].users_updatedAt
        };
        console.log((objUser));
        res.status(201).json(objUser);
      })
  });

  return authController;
};
