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
    var myBookmark = {
      boardId: req.body.boardId,
      title: req.body.title,
      url: req.body.url,
      description: req.body.description
    };
    dataLoader.updateBookmark(req.params.id, myBookmark)
      .then((data) => {
        console.log(data);
      })
      .catch(err => res.status(400).json(err));
  });


  // Delete a bookmark
  bookmarksController.delete('/:id', onlyLoggedIn, (req, res) => {
    dataLoader.deleteBookmark(req.params.id)
      .then((data) => {
        console.log(data);
    })
      .catch(err => res.status(400).json(err));
  });

  return bookmarksController;
};
