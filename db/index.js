const dbConfig = require('../knexfile');
const client = require('knex')(dbConfig);

module.exports = client;