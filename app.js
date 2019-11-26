const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { err404, err500 } = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);

app.all('*', err404);

module.exports = app;