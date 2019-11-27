process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const client = require('../db')


describe.only('/api', () => {
    after(() => client.destroy());
    beforeEach(function() { 
        this.timeout(4000)
        return client.seed.run()
    });
    describe('INVALID HTTP METHOD', () => {
        it('Status: 405 returns error when an invalid HTTP method is entered on any endpoint', () => {
            return request(app)
                .delete('/api/topics')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                });
        });
    });
    describe('/topics', () => {
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
                it('Status: 405 returns error when an invalid HTTP method is used', () => {
                    return request(app)
                        .delete('/api/users/butter_bridge')
                        .expect(405)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
                        });
                });
            });
        });
    });
    describe('/articles', () => {
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
                it('Status: 404 error handled when a valid but non-existent username is passed', () => {
                    return request(app)
                        .get('/api/articles/42')
                        .expect(404)
                        .then(({ body : { msg } }) => {
                            expect(msg).to.equal('Article not found.');
                        });
                });
                it('Status: 400 returns error when an invalid and non-existent username is passed', () => {
                    return request(app)
                        .get('/api/articles/banana')
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Bad request.')
                        });
                });
            });
            describe('PATCH', () => {
                it('Status: 201 returns a single article object with its votes value updated', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 1 })
                        .expect(201)
                        .then(({ body: { article } }) => {
                            expect(article.votes).to.equal(101);
                        });
                });
                it('Status: 201 returns a single article object with required keys', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 1 })
                        .expect(201)
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
        });
        describe.only('/:article_id/comments', () => {
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
            });
        });
    });
});
                // 404 - thrown when a valid id is given but desn't exist
                // 400 - invalid data type is passed for id
                // 405 - invalid method used on this endpoint

                // check for order of returned array first, where _count is present and testing count value