const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const List = require('../models/list');
const helper = require('./helper');

const api = supertest(app);

// Initialize the test database before each test is run
beforeEach(async () => {
  // Wipe the database
  await List.deleteMany({});

  // Repopulate the database using initialLists
  const promises = [];
  helper.initialLists.forEach((list) => promises.push(new List(list).save()));

  await Promise.all(promises);
});

describe('fetching all lists', () => {
  test('lists are returned as json', async () => {
    await api
      .get('/api/lists')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
