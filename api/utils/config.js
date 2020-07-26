require('dotenv').config();

const { PORT } = process.env;
let { MONGODB_URI } = process.env;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_URI_TEST;
}

module.exports = { PORT, MONGODB_URI };
