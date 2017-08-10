/* eslint-disable spaced-comment */
const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const bookmarksController = express.Router();

  // Modify a bookmark
  bookmarksController.patch('/:id', onlyLoggedIn, (req, res) => {
    console.log("I am here in bookmarks/id");
    console.log(req.params.id);
    console.log(req.body.title);
    console.log(req.body.url);
    console.log(req.body.description);
    console.log(req.user[0]);

    var myBookmark = {
      boardId: req.params.id,
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      user: req.user[0]
    };
    dataLoader.updateBookmark(req.params.id, myBookmark)
      .then(data => {
        console.log(data);
        var objBookmark ={
          id: data[0].id,
          boardId: data[0].boardId,
          title: data[0].title,
          url: data[0].url,
          description: data[0].description,
          createdAt: data[0].createdAt,
          updatedAt: data[0].updatedAt
        };
        res.status(201).json(objBookmark);
      })
      .catch(err => res.status(400).json({error: err.message}));
  });


  // Delete a bookmark
  bookmarksController.delete('/:id', onlyLoggedIn, (req, res) => {

    var bookmarkData = {
      bookmarkId: req.params.id,
      userId: req.user[0].users_id
    }

    dataLoader.deleteBookmark(bookmarkData)
      .then(data => {
        res.status(204).end()
      })
      .catch(err => res.status(400).json({error: err.message}));
  });

  return bookmarksController;
};
