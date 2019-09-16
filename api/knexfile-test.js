require('dotenv').config({ path: '.env' });

module.exports = {
  client: 'mysql',
  connection: {
    port: process.env.TEST_DB_PORT,
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
  },
  migrations: {
    directory: `${__dirname}/migrations`,
  }
};
