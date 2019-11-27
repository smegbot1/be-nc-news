const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers');
const { err405, username400 } = require('../errors');

usersRouter
    .route('/:username')
    .get(getUserByUsername)
    .all(err405);

usersRouter
    .route('/*')
    .get(username400)
    .all(err405);

module.exports = usersRouter;