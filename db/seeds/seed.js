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
      /*
      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      */

      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(commentData, articleRef, 'belongs_to', 'article_id');
      return knex('comments').insert(formattedComments);
    });
};
