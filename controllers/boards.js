const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const boardsController = express.Router();

  boardsController.get('/', (req, res) => {
    dataLoader.getAllBoards({
      page: req.query.page,
      limit: req.query.count
    })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });

  boardsController.get('/:id', (req, res) => {
    dataLoader.getSingleBoard(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });

  boardsController.post('/', onlyLoggedIn, (req, res) => {
    dataLoader.createBoard({
      ownerId: req.user.id,
      title: req.body.title,
      description: req.body.description
    })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json(err));
  });

  boardsController.patch('/:id', onlyLoggedIn, (req, res) => {
    dataLoader.boardBelongsToUser(req.params.id, req.user.id)
    .then(() => {
      return dataLoader.updateBoard(req.params.id, {
        title: req.body.title,
        description: req.body.description
      });
    })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });

  boardsController.delete('/:id', onlyLoggedIn, (req, res) => {
    dataLoader.boardBelongsToUser(req.params.id, req.user.id)
    .then(() => {
      return dataLoader.deleteBoard(req.params.id);
    })
    .then(() => res.status(204).end())
    .catch(err => res.status(400).json(err));
  });

  boardsController.post('/:id/bookmarks', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
  });

  return boardsController;
};
