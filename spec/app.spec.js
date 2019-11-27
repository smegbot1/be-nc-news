process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const client = require('../db')


describe.only('/api', () => {
    after(() => client.destroy());
    beforeEach(function() { 
        this.timeout(3000)
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
                it('Status: 405 returns error when an invalid HTTP method is used', () => {
                    return request(app)
                        .delete('/api/articles/1')
                        .expect(405)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Invalid HTTP method used. Be reasonable man!')
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
            describe.only('PATCH', () => {
                it('Status: 201 returns a single article object with its votes value updated', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 1 })
                        .expect(201)
                        .then(({ body: { article } }) => {
                            expect(article.votes).to.equal(101);
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