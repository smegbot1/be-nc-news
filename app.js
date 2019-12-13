const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { err404, err500, customErr, err400, err422 } = require('./errors');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.all('/*', err404);

app.use(customErr);
app.use(err400);
app.use(err422);
app.use(err500);

module.exports = app;