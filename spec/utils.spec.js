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
  it('function retains all keys of an object passed in the array', () => {
    const input = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389
    }];
    expect(formatDates(input)[0]).to.have.keys(['title', 'topic', 'author', 'body', 'created_at'])
  });
  it('function works for multiple objects passed in an array', () => {
    const input = [  {
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    },
    {
      title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
      created_at: 1500584273256,
    },
    {
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    }];
    const output = [  {
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: new Date(1471522072389),
    },
    {
      title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
      created_at: new Date(1500584273256),
    },
    {
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: new Date(1500659650346),
    }];
    expect(formatDates(input)).to.eql(output);
  });
  it('function should not mutate the original array', () => {
    const input = [{ created_at: 1471522072389 }];
    const expected = [{ created_at: 1471522072389 }];
    formatDates(input);
    expect(input).to.eql(expected);
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
