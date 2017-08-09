/* eslint-disable spaced-comment */
const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const bookmarksController = express.Router();

  bookmarksController.get('/:id', (req, res) => {
    dataLoader.getAllBookmarksForBoard(req.params.id)
      .then(data => res.json(data))
  });

  // Modify a bookmark
  bookmarksController.patch('/:id', onlyLoggedIn, (req, res) => {
    var myBookmark = {
      boardId: req.params.id,
      title: req.body.title,
      url: req.body.url,
      description: req.body.description
    };
    dataLoader.updateBookmark(req.params.id, myBookmark)
      .then(data => res.status(201).json(data))
      .catch(err => res.status(400).json({error: err.message}));
  });


  // Delete a bookmark
  bookmarksController.delete('/:id', onlyLoggedIn, (req, res) => {
    dataLoader.deleteBookmark(req.params.id)
      .then(data => res.status(204).end())
      .catch(err => res.status(400).json({error: err.message}));
  });

  return bookmarksController;
};
