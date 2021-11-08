const express = require('express');
const notificationRouter = express.Router();

const catchAsync = require('../utils/catchAsync.js');

const CustomError = require('../utils/customError.js');

notificationRouter.get('/', catchAsync(async(req, res, next)=> {
    throw new CustomError('BETA - Feature is a WORK IN PROGRESS', 404);
}))

module.exports = notificationRouter;