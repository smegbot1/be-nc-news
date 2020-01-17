process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const client = require('../db')


describe('/api', () => {
    after(() => client.destroy());
    beforeEach(function() { 
        this.timeout(4000)
        return client.seed.run()
    });
    it('Status: 405 returns error when an invalid HTTP method is used', () => {
        return request(app)
            .patch('/api')
            .expect(405)
            .then(({ body: { msg } }) => {
                expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
            });
    });
    it('Status: 418 OMFG TEEEEPOT ZOMG LMAO', () => {
        return request(app)
            .delete('/api')
            .expect(418)
            .then(({ body: { msg } }) => {
                expect(msg).to.equal('OMFG TEEEEPOT ZOMG LMAO')
            });
    });
    describe('GET', () => {
        it('Status: 200 returns a json object of all available endpoints and related meta', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body: { endpoints } }) => {
                    expect(endpoints).to.be.an('object');
                    expect(endpoints).to.have.keys(
                        "GET /api",
                        "GET /api/topics",
                        "GET /api/users/:username",
                        "GET /api/articles",
                        "GET /api/articles/:article_id",
                        "PATCH /api/articles/:article_id",
                        "POST /api/articles/:article_id/comments",
                        "GET /api/articles/:article_id/comments",
                        "PATCH /api/comments/:comment_id",
                        "DELETE /api/comments/:comment_id"
                    );
                });
        });
    });
    describe('/topics', () => {
        it('Status: 405 returns error when an invalid HTTP method is used', () => {
            return request(app)
                .delete('/api/topics')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                });
        });
        describe('GET', () => {
            it('Status: 200 returns an array of topics', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then(({ body: { topics } }) => {
                        expect(topics).to.be.an('array');
                        expect(topics.length).to.equal(3);
                    });
            });
            it('Status: 200 returns array of topics with required keys', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then(({ body: { topics } }) => {
                        expect(topics[0]).to.have.keys('slug', 'description');
                    })
            });
        });
    });
    describe('/users', () => {
        describe('/:username', () => {
            it('Status: 405 returns error when an invalid HTTP method is used', () => {
                return request(app)
                    .delete('/api/users/butter_bridge')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                    });
            });
            describe('GET', () => {
                it('Status: 200 returns single user object with required keys', () => {
                    return request(app)
                        .get('/api/users/butter_bridge')
                        .expect(200)
                        .then(({ body: { user } }) => {
                            expect(user).to.have.keys('username', 'avatar_url', 'name');
                        });
                });
                it('Status: 404 error handled when a valid but non-existent username is passed', () => {
                    return request(app)
                        .get('/api/users/bananas')
                        .expect(404)
                        .then(({ body : { msg } }) => {
                            expect(msg).to.equal('Username not found.');
                        });
                });
            });
        });
    });
    describe('/articles', () => {
        it('Status: 405 returns error when an invalid HTTP method is used', () => {
            return request(app)
                .delete('/api/articles')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                });
        });
        describe('GET', () => {
            it('Status: 200 returns an array of the first 5 articles from database', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).to.be.an('array');
                        expect(articles.length).to.equal(5);
                    });
            });
            it('Status: 200 returns an array of all articles with required keys along with total article count for query', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({ body: { articles, article_count } }) => {
                        expect(articles[0]).to.have.keys(
                            'author',
                            'title',
                            'article_id',
                            'topic',
                            'created_at',
                            'votes',
                            'comment_count'
                        );
                        expect(article_count).to.equal(12)
                    });
            });
            it('Status: 200 returns sorted array by default column created_at and default order descending', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).to.be.sortedBy('created_at', { descending: true });
                    });
            });
            it('Status: 200 returns query sorted array of articles', () => {
                return request(app)
                    .get('/api/articles?sort_by=author&&order=asc')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).to.be.sortedBy('author');
                    });
            });
            it('Status: 200 returns author query filtered articles', () => {
                return request(app)
                    .get('/api/articles?author=icellusedkars')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).to.equal(5);
                        for (let i = 0; i < articles.length; i ++)
                        expect(articles[i].author).to.eql('icellusedkars');
                    });
            });
            it('Status: 200 returns empty article array when queried by existing author with no articles to their name', () => {
                return request(app)
                    .get('/api/articles?author=lurker')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).to.equal(0);
                        expect(articles[0]).to.equal(undefined);
                });
            });
            it('Status: 200 returns topic query filtered articles', () => {
                return request(app)
                    .get('/api/articles?topic=mitch')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).to.equal(5);
                        for (let i = 0; i < articles.length; i ++)
                        expect(articles[i].topic).to.eql('mitch');
                    });
            });
            it('Status: 200 returns only the first 11 articles when entering a limit query of 10', () => {
                return request(app)
                    .get('/api/articles?limit=10')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).to.equal(10);
                    });
            });
            it('Status: 200 returns only the last 2 articles when querying offset to be 10', () => {
                return request(app)
                    .get('/api/articles?offset=10')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).to.equal(2);
                    });
            });
            it('Status: 200 returns empty article array when queried by existing topic with no articles', () => {
                return request(app)
                    .get('/api/articles?topic=paper')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).to.equal(0);
                        expect(articles[0]).to.equal(undefined);
                    });
            });
            it('Status: 400 returns error if something other than asc or desc is passed for order query', () => {
                return request(app)
                    .get('/api/articles?order=banana')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Query can only take ascending or descending order.')
                    });
            });
            it('Status: 400 returns error if passed a non-existent sort_by query', () => {
                return request(app)
                    .get('/api/articles?sort_by=bananas')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Bad request.');
                    });
            });
            it('Status: 404 returns error if passed a non-existent author query', () => {
                return request(app)
                    .get('/api/articles?author=bananas')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Author not found.');
                    });
            });
            it('Status: 404 returns error if passed a non-existent topic query', () => {
                return request(app)
                    .get('/api/articles?topic=bananas')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Topic not found.');
                    });
            });
        });
        describe('/:article_id', () => {
            it('Status: 405 returns error when an invalid HTTP method is used', () => {
                return request(app)
                    .delete('/api/articles/1')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                    });
            });
            describe('GET', () => {
                it('Status: 200 returns a single article object with required keys', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then(({ body: { article } }) => {
                            expect(article).to.have.keys(
                                'author',
                                'title',
                                'article_id',
                                'body',
                                'topic',
                                'created_at',
                                'votes',
                                'comment_count'
                            );
                            expect(article.comment_count).to.equal('13');
                        });
                });
                it('Status: 404 error handled when a valid but non-existent article_id is passed', () => {
                    return request(app)
                        .get('/api/articles/42')
                        .expect(404)
                        .then(({ body : { msg } }) => {
                            expect(msg).to.equal('Article not found.');
                        });
                });
                it('Status: 400 returns error when an invalid and non-existent article_id is passed', () => {
                    return request(app)
                        .get('/api/articles/banana')
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Bad request.')
                        });
                });
            });
            describe('PATCH', () => {
                it('Status: 200 returns a single article object with its votes value updated', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 1 })
                        .expect(200)
                        .then(({ body: { article } }) => {
                            expect(article.votes).to.equal(101);
                        });
                });
                it('Status: 200 returns a single article object with required keys', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 1 })
                        .expect(200)
                        .then(({ body: { article } }) => {
                            expect(article).to.have.keys(
                                'author',
                                'title',
                                'article_id',
                                'body',
                                'topic',
                                'created_at',
                                'votes',
                                'comment_count'
                            );
                        });
                });
                it('Status: 200 returns selected article object unchanged if no patch data is sent', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .expect(200)
                        .then(({ body : { article } }) => {
                            expect(article.votes).to.equal(100);
                            expect(article).to.have.keys(
                                'author',
                                'title',
                                'article_id',
                                'body',
                                'topic',
                                'created_at',
                                'votes',
                                'comment_count'
                            );
                        });
                });
                it('Status: 404 error handled when a valid but non-existent username is passed', () => {
                    return request(app)
                        .patch('/api/articles/42')
                        .send({ inc_votes: 1 })
                        .expect(404)
                        .then(({ body : { msg } }) => {
                            expect(msg).to.equal('Article not found.');
                        });
                });
                it('Status: 400 returns error for invalid and non-existent username', () => {
                    return request(app)
                        .patch('/api/articles/banana')
                        .send({ inc_votes: 1 })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Bad request.')
                        });
                });
                it('Status: 400 returns error when data passed is of invalid type', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 'banana' })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Bad request.')
                        });
                });
            });
            describe('/:article_id/comments', () => {
                it('Status: 405 returns error when an invalid HTTP method is used', () => {
                    return request(app)
                        .patch('/api/articles/1/comments')
                        .expect(405)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                        });
                });
                describe('POST', () => {
                    it('Status: 201 returns newly posted comment object', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ username: 'butter_bridge', body: 'No Patrick, mayonaise is not an instrument.'})
                            .expect(201)
                            .then(({ body: { comment } }) => {
                                expect(comment.author).to.eql('butter_bridge');
                                expect(comment.body).to.eql('No Patrick, mayonaise is not an instrument.');
                            });
                    });
                    it('Status: 201 returns newly posted comment object with required keys', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ username: 'butter_bridge', body: 'No Patrick, mayonaise is not an instrument.'})
                            .expect(201)
                            .then(({ body: { comment } }) => {
                                expect(comment).to.have.keys(
                                    'article_id',
                                    'author',
                                    'body',
                                    'comment_id',
                                    'created_at',
                                    'votes'
                                );
                            });
                    });
                    it('Status: 422 sql error handled for trying to insert non-existent id as a foreign key', () => {
                        return request(app)
                            .post('/api/articles/42/comments')
                            .send({ username: 'butter_bridge', body: 'No Patrick, mayonaise is not an instrument.' })
                            .expect(422)
                            .then(({ body : { msg } }) => {
                                expect(msg).to.equal('Unprocessable request.');
                            });
                    });
                    it('Status: 422 returns error when incorrect data type username is passed', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ username: 42, body: 'No Patrick, mayonaise is not an instrument.' })
                            .expect(422)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Unprocessable request.');
                            });
                    });
                    it('Status: 400 returns bad request when post body is missing a required column', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ cheese: 'true' })
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Bad request.');
                            });
                    });
                    it('Status: 400 returns bad request when post body is missing a username column', () => {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ body: 'true' })
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Bad request.');
                            });
                    });
                });
                describe('GET', () => {
                    it('Status: 200 returns an array of comments for a given article along with a total comment count for that article', () => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then(({ body: { comments, comment_count } }) => {
                                expect(comments).to.be.an('array');
                                expect(comments.length).to.equal(10);
                                expect(comment_count).to.equal(18)
                            });
                    });
                    it('Status: 200 returns an array of comment objects with required keys', () => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments[0]).to.have.keys(
                                    'comment_id',
                                    'votes',
                                    'created_at',
                                    'author',
                                    'body'
                                );
                            });
                    });
                    it('Status: 200 returns default sorted array of comments - created_at', () => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).to.be.sortedBy('created_at', { descending: true });
                            });
                    });
                    it('Status: 200 returns query sorted array of comments', () => {
                        return request(app)
                            .get('/api/articles/1/comments?sort_by=comment_id')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).to.be.sortedBy('comment_id', { descending: true });
                            });
                    });
                    it('Status: 200 returns array in default descending order', () => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).to.be.sortedBy('created_at', { descending: true });
                            });
                    });
                    it('Status: 200 returns array of comments queried with sort_by and order', () => {
                        return request(app)
                            .get('/api/articles/1/comments?order=asc&&sort_by=comment_id')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).to.be.sortedBy('comment_id');
                            });
                    });
                    it('Status: 200 returns array 11 comments with limit query', () => {
                        return request(app)
                            .get('/api/articles/1/comments?limit=11')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments.length).to.equal(11);
                            });
                    });
                    it('Status: 200 returns array of 3 comments on the second page with offset of 10', () => {
                        return request(app)
                            .get('/api/articles/1/comments?offset=10')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments.length).to.equal(3);
                            });
                    });
                    it('Status: 404 error handled when a valid but non-existent article_id is passed', () => {
                        return request(app)
                            .get('/api/articles/42/comments')
                            .expect(404)
                            .then(({ body : { msg } }) => {
                                expect(msg).to.equal('Article not found.');
                            });
                    });
                    it('Status: 400 returns error if passed a non-existent sort_by query', () => {
                        return request(app)
                            .get('/api/articles/1/comments?sort_by=bananas')
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Bad request.');
                            });
                    });
                    it('Status: 400 returns error if something other than asc or desc is passed for order query', () => {
                        return request(app)
                            .get('/api/articles/1/comments?order=banana')
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Query can only take ascending or descending order.')
                            });
                    });
                });
            });
        });
    });
    describe('/comments', () => {
        describe('/:comment_id', () => {
            it('Status: 405 returns error when an invalid HTTP method is used', () => {
                return request(app)
                    .get('/api/comments/1')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                    });
            });
            describe('PATCH', () => {
                it('Status: 200 returns an updated votes comment with required keys', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 2 })
                        .expect(200)
                        .then(({ body: { comment } }) => {
                            expect(comment).to.be.an('object');
                            expect(comment).to.have.keys(
                                'article_id',
                                'author',
                                'body',
                                'comment_id',
                                'created_at',
                                'votes'
                                );
                        });
                });
                it('Status: 200 returns correctly updated votes value with comment', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 2 })
                        .expect(200)
                        .then(({ body: { comment } }) => expect(comment.votes).to.equal(18));
                });
                it('Status: 200 returns unchanged comment where inc_votes is not passed', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({})
                        .expect(200)
                        .then(({ body: { comment } }) => {
                            expect(comment.votes).to.equal(16);
                            expect(comment).to.have.keys(
                                'article_id',
                                'author',
                                'body',
                                'comment_id',
                                'created_at',
                                'votes'
                            );
                        });
                });
                it('Status: 404 error handled when a valid but non-existent comment_id is passed', () => {
                    return request(app)
                        .patch('/api/comments/42')
                        .send({ inc_votes: 2 })
                        .expect(404)
                        .then(({ body : { msg } }) => expect(msg).to.equal('Comment not found.'));
                });
                it('Status: 400 returns error when an invalid comment_id is passed', () => {
                    return request(app)
                        .patch('/api/comments/bananas')
                        .send({ inc_votes: 2 })
                        .expect(400)
                        .then(({ body: { msg } }) => expect(msg).to.equal('Bad request.'));
                });
                it('Status: 400 returns error when inc_votes is not a number', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 'bananas' })
                        .expect(400)
                        .then(({ body: { msg } }) => expect(msg).to.equal('Bad request.'));
                });
            });
            describe('DELETE', () => {
                it('Status: 204 request deletes selected comment from comments table', () => {
                    return request(app)
                        .delete('/api/comments/1')
                        .expect(204)
                        .then(() => request(app).get('/api/articles/9/comments').expect(200))
                        .then(({ body: { comments } }) => expect(comments.length).to.equal(1));
                });
                it('Status: 404 returns error when a valid but non-existent comment_id is passed', () => {
                    return request(app)
                        .delete('/api/comments/42')
                        .expect(404)
                        .then(({ body: { msg } }) => expect(msg).to.equal('Comment not found.'));
                });
                it('Status: 400 returns error when an invalid comment_id is passed', () => {
                    return request(app)
                        .delete('/api/comments/bananas')
                        .expect(400)
                        .then(({ body: { msg } }) => expect(msg).to.equal('Bad request.'));
                });
            });
        });
    });
});
                // 404 - thrown when a valid id is given but desn't exist
                // 400 - invalid data type or non-existent parameter/query is passed
                // 405 - invalid method used on this endpoint
                // 418 - OMFG TEEEEPOT ZOMG
                // 422 - unprocessable request (e.g. inserting non-existent foreign key)

                // check for order of returned array first, where _count is present and testing count value