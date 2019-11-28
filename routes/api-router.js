const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const { err405 } = require('../errors');
const { getEndpoints } = require('../controllers');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
    .route('/')
    .get(getEndpoints)
    .delete((req, res, next) => Promise.reject({ status: 418, msg: 'OMFG TEEEEPOT ZOMG LMAO' }).catch(next))
    .all(err405);

module.exports = apiRouter;