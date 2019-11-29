const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;
const { username, password } = require('./config');

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: 'nc_news',
      username,
      password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username,
      password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
