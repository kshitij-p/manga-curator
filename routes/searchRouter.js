const express = require('express');
const searchRouter = express.Router();
const searchController = require('../controllers/searchController.js');


const catchAsync = require('../utils/catchAsync');

searchRouter.get('/', catchAsync(searchController.search));

searchRouter.get('/list/:name', catchAsync(searchController.getList));


searchRouter.post('/cache/', catchAsync(searchController.postSimilarCache));

searchRouter.get('/:id', catchAsync(searchController.getSimilar));


module.exports = searchRouter;