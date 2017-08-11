const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const boardsController = express.Router();

  // Retrieve a list of boards
  boardsController.get('/', (req, res) => {
    dataLoader.getAllBoards({
      page: req.query.page,
      limit: req.query.count
    })
    .then(data => {
      var objBoards = {
        boards: data
      };
      res.status(201).json(objBoards);
    })
    .catch(err => res.status(400).status(201).json(err));
  });


  // Retrieve a single board
  boardsController.get('/:id', (req, res) => {
    dataLoader.getSingleBoard(req.params.id)
    .then(data => {
      var objBoard = {
        id: data[0].id,
        ownerId: data[0].ownerId,
        title: data[0].title,
        description: data[0].description,
        createdAt: data[0].createdAt,
        updatedAt: data[0].updatedAt,
        isListed: data[0].isListed
      };
      res.status(201).json(objBoard);
    })
    .catch(err => res.status(400).json(err));
  });


  // Create a new board
  boardsController.post('/', onlyLoggedIn, (req, res) => {
    console.log("Req userId= ", req.user[0].users_id);
    console.log("Req user= ", req.user);
    dataLoader.createBoard({
      ownerId: req.user[0].users_id,
      title: req.body.title,
      description: req.body.description,
      isListed: req.body.isListed
    })
    .then(data => {
      var objBoard = {
        id: data[0].id,
        ownerId: data[0].ownerId,
        title: data[0].title,
        description: data[0].description,
        createdAt: data[0].createdAt,
        updatedAt: data[0].updatedAt,
        isListed: data[0].isListed
      };
      res.status(201).json(objBoard);
    })
    .catch(err => res.status(400).json(err));
  });


  // Modify an owned board
  boardsController.patch('/:id', onlyLoggedIn, (req, res) => {
    // First check if the board to be PATCHed belongs to the user making the request
    dataLoader.boardBelongsToUser(req.params.id, req.user[0].users_id)
    .then(() => {
      return dataLoader.updateBoard(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        isListed: req.body.isListed
      });
    })
    .then(data => {

      var objBoard = {
        id: data[0].id,
        ownerId: data[0].ownerId,
        title: data[0].title,
        description: data[0].description,
        createdAt: data[0].createdAt,
        updatedAt: data[0].updatedAt,
        isListed: data[0].isListed
      };

      res.status(201).json(objBoard);
    })
    .catch(err => res.status(400).json({error: err.message}));
  });


  // Delete an owned board
  boardsController.delete('/:id', onlyLoggedIn, (req, res) => {
    // First check if the board to be DELETED belongs to the user making the request
    dataLoader.boardBelongsToUser(req.params.id, req.user[0].users_id)
    .then(() => {
      return dataLoader.deleteBoard(req.params.id);
    })
    .then(() => res.status(204).end())
    .catch(err => res.status(400).json({error: err.message}));
  });


  // Retrieve all the bookmarks for a single board
  boardsController.get('/:id/bookmarks', (req, res) => {
    dataLoader.getAllBookmarksForBoard(req.params.id)
      .then(data => {
        var objBookmarks ={
          bookmarks: data
        }
        res.status(201).json(objBookmarks);
      })
      .catch(error => res.status(400).json(err));
  });

  // Create a new bookmark under a board
  boardsController.post('/:id/bookmarks', onlyLoggedIn, (req, res) => {
    console.log('REQ.PARAMS: ', JSON.stringify(req.params));
    console.log('REQ.BODY: ',JSON.stringify(req.body));
    dataLoader.createBookmark({
      boardId: req.params.id,
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      user: req.user[0]
    })
      .then(data => {
        var objBookmark ={
          id: data[0].id,
          boardId: data[0].boardId,
          title: data[0].title,
          url: data[0].url,
          description: data[0].description,
          createdAt: data[0].createdAt,
          updatedAt: data[0].updatedAt
        }
        res.status(201).json(objBookmark);
      })
      .catch(error => res.status(400).json({error: error.message}));
  });

  return boardsController;
};
