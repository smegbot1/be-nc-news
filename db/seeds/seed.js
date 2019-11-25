const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  const topicsInsertions = knex('topics').insert(topicData);
  const usersInsertions = knex('users').insert(userData);

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions])
    })
    .then(() => {
      const amendedArticles = formatDates(articleData);
      return knex('articles').insert(amendedArticles).returning('*');
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(commentData, articleRef, 'belongs_to', 'article_id');
      return knex('comments').insert(formattedComments);
    });
};
