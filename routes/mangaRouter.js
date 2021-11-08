const express = require('express');

const mangaRouter = express.Router();
const mangaController = require('../controllers/mangaController');
const catchAsync = require('../utils/catchAsync');

mangaRouter.get('/', catchAsync(mangaController.redirectToSearch));

mangaRouter.get('/:id', catchAsync(mangaController.getManga));

module.exports = mangaRouter;