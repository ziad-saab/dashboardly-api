const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const bookmarksController = express.Router();

  bookmarksController.patch('/:id', onlyLoggedIn(dataLoader), (req, res) => {

  });

  bookmarksController.delete('/:id', onlyLoggedIn(dataLoader), (req, res) => {

  });

  return bookmarksController;
};
