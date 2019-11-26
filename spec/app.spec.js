process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const client = require('../db')

after(() => client.destroy());
beforeEach(() => client.seed.run());

describe('/api', () => {
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
        });
    });
});