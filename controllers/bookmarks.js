const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const bookmarksController = express.Router();

  bookmarksController.patch('/:id', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
  });

  bookmarksController.delete('/:id', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
  });

  return bookmarksController;
};
