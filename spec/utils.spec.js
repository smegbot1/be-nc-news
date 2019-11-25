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
    expect(formatDates(input)).to.eql(new Date(1471522072389));
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
