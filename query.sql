\c nc_news_test

SELECT articles.article_id, COUNT(comment_id) AS comment_count FROM articles WHERE article_id = 1 LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;
-- , count('comment_id') as comment_count 