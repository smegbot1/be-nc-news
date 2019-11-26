process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const client = require('../db')


describe.only('/api', () => {
    after(() => client.destroy());
    beforeEach(() => client.seed.run());
    describe('INVALID PATH', () => {
        it('Status: 404 returns error when an invalid path is entered on any endpoint', () => {
            return request(app)
                .get('/api/does-not-exist')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Path not found, please enter an existing path.')
                });
        });
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
                it('Status: 200 returns single user by matching username', () => {
                    return request(app)
                        .get('/api/users/butter_bridge')
                        .expect(200)
                        .then(({ body: { user } }) => {
                            expect(user).to.be.an('array');
                            expect(user.length).to.equal(1);
                        });
                });
                it('Status: 200 returns single user with required keys', () => {
                    return request(app)
                        .get('/api/users/butter_bridge')
                        .expect(200)
                        .then(({ body: { user } }) => {
                            expect(user[0]).to.have.keys('username', 'avatar_url', 'name');
                        });
                });
            });
        });
    });
    describe('/articles', () => {
        describe('/:article_id', () => {
            describe('GET', () => {
                it('Status: 200 returns an array with a single article matching the article_id', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then(({ body: { article } }) => {
                            expect(article).to.be.an('array');
                            expect(article.length).to.equal(1);
                        });
                });
            });
        });
    });
});