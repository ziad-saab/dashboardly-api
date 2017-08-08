/* eslint-disable spaced-comment */
const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const bookmarksController = express.Router();

  bookmarksController.get('/:id', (req, res) => {
    dataLoader.getAllBookmarksForBoard(req.params.id)
      .then((data) => {
        console.log('This is my result: ', data);
        res.send('Request processed!');
      });
  });

  // Modify a bookmark
  bookmarksController.patch('/:id', onlyLoggedIn, (req, res) => {
    console.log(req.body.title);
    res.status(500).json({ error: 'not implemented' });
  });


  // Delete a bookmark
  bookmarksController.delete('/:id', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
    res.status(500).json({ error: 'not implemented' });
  });

  return bookmarksController;
};
