const usersRouter = require('express').Router();
const { getUserById } = require('../controllers');
const { err405 } = require('../errors');

usersRouter
    .route('/:user_id')
    .get(getUserById)
    .all(err405);