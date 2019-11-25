const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('function returns a new array from the input array', () => {
    const input = [];
    expect(formatDates(input)).to.eql([]);
    expect(formatDates(input)).to.not.equal(input);
  });
  it('function returns a new array with a single object in which the timestamp property has been modified', () => {
    const input = [{ created_at: 1471522072389 }];
    expect(formatDates(input)[0].created_at).to.eql(new Date(1471522072389));
  });
  it('function returns a new array with a single fully populated object with a modified timestamp', () => {
    const input = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389
    }];
    expect(formatDates(input)[0].created_at).to.eql(new Date(1471522072389))
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
