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

  test('all lists are returned', async () => {
    const response = await api.get('/api/lists');
    expect(response.body).toHaveLength(helper.initialLists.length);
  });

  test('list names are saved on upload', async () => {
    const response = await api.get('/api/lists');

    // Save all of the list names
    const names = response.body.map((r) => r.name);

    // Check that the list name we are looking for exists
    expect(names).toContain(helper.initialLists[0].name);
  });
});

describe('adding new lists', () => {
  test('a valid list can be added', async () => {
    const newList = { name: 'My New List' };

    // Add new list to the database and verify it worked
    await api
      .post('/api/lists')
      .send(newList)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // We should have more lists than we started with
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length + 1);

    // The new list should have the right name
    const names = listsAtEnd.map((l) => l.name);
    expect(names).toContain(newList.name);
  });

  test('invalid list is not added', async () => {
    const invalidList = { price: 100 };

    // Server should reject our request
    await api.post('/api/lists').send(invalidList).expect(400);

    // Database should not have any new lists
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
