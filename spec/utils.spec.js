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

describe('makeRefObj', () => {
  it('function returns a new empty object when an empty array is passed', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('function returns a single reference inside a new object when an array with a single object is passed', () => {
    const input = [{ article_id: 1, title: 'A' }];
    expect(makeRefObj(input, 'title', 'article_id')).to.eql({ A: 1 });
  });
  it('function returns multiple reference keys in an object where multiple objects are present in the passed array', () => {
    const input = [{
      article_id: 1,
      title: 'Running a node app',
      body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      votes: 0,
      topic: 'coding',
      author: 'jessjelly',
      created_at: '2016-08-18 13:07:52.389+01'
    },
    {
      article_id: 2,
      title: 'Running a node app 2',
      body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      votes: 0,
      topic: 'coding',
      author: 'jessjelly',
      created_at: '2016-08-18 13:07:52.389+01'
    },
    {
      article_id: 3,
      title: 'Running a node app 3',
      body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      votes: 0,
      topic: 'coding',
      author: 'jessjelly',
      created_at: '2016-08-18 13:07:52.389+01'
    }]
    expect(makeRefObj(input, 'title', 'article_id')).to.eql({
      'Running a node app': 1,
      'Running a node app 2': 2,
      'Running a node app 3': 3 
    });
  });
  it('function does not mutate original input array', () => {
    const input = [{ article_id: 1, title: 'A' }];
    const expected = [{ article_id: 1, title: 'A' }];
    makeRefObj(input, 'title', 'article_id')
    expect(input).to.eql(expected);
  });
});

describe('formatComments', () => {
  it('function returns an empty new array when an empty array is passed', () => {
    const input = [];
    expect(formatComments(input)).to.eql([]);
    expect(formatComments(input)).to.not.equal(input);
  });
  it('function returns an array with a modified object, having replaced created_by with author', () => {
    const input = [{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389
    }];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const expected = [{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 1,
      author: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389)
    }];
    expect(formatComments(input, ref, 'belongs_to', 'article_id')).to.eql(expected)
  });
  it('function returns corrected data with multiple objects passed in array', () => {
    const input = [{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389
    },{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're dogs, are they?",
      created_by: 'margarine_bridge',
      votes: 16,
      created_at: 1511354163973
    },{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "are they?",
      created_by: 'oil_bridge',
      votes: 16,
      created_at: 1511355163389
    }];
    const ref = { "They're not exactly dogs, are they?": 1, "They're dogs, are they?": 2, "are they?": 3 };
    const expected = [{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 1,
      author: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389)
    },{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 2,
      author: 'margarine_bridge',
      votes: 16,
      created_at: new Date(1511354163973)
    },{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 3,
      author: 'oil_bridge',
      votes: 16,
      created_at: new Date(1511355163389)
    }];
    expect(formatComments(input, ref, 'belongs_to', 'article_id')).to.eql(expected);
  });
  it('function does not mutate original input array', () => {
    const input = [{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389
    }];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const expected = [{ 
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389
    }];
    formatComments(input, ref, 'belongs_to', 'article_id')
    expect(input).to.eql(expected);
  });
});
