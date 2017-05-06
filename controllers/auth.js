const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const authController = express.Router();

  authController.post('/users', (req, res) => {

  });

  authController.post('/sessions', (req, res) => {

  });

  authController.delete('/sessions', onlyLoggedIn(dataLoader), (req, res) => {

  });

  return authController;
};
