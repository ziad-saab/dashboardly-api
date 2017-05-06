const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const boardsController = express.Router();

  boardsController.get('/', (req, res) => {

  });

  boardsController.get('/:id', (req, res) => {

  });

  boardsController.post('/', onlyLoggedIn(dataLoader), (req, res) => {

  });

  boardsController.patch('/:id', onlyLoggedIn(dataLoader), (req, res) => {

  });

  boardsController.delete('/:id', onlyLoggedIn(dataLoader), (req, res) => {

  });

  boardsController.post('/:id/bookmarks', onlyLoggedIn(dataLoader), (req, res) => {

  });

  return boardsController;
};
