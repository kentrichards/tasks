const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const List = require('../models/list');
const helper = require('./helper');
const lists = require('../controllers/lists');

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

describe('fetching one list', () => {
  test('a specific list can be retrieved', async () => {
    const listsAtStart = await helper.getLists();
    const listToView = listsAtStart[0];

    const resultList = await api
      .get(`/api/lists/${listToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Don't check for full equality because of the date field
    expect(resultList.body.id).toEqual(listToView.id);
    expect(resultList.body.name).toEqual(listToView.name);
  });

  test('fetching a list with a non-existing id returns an error', async () => {
    const nonExistingId = helper.nonExistingId();

    // Server should return '404 Not Found', because the request was valid
    await api.get(`/api/lists/${nonExistingId}`).expect(404);
  });

  test('fetching a list with an invalid id returns an error', async () => {
    const invalidId = 1;

    // Server should return '400 Bad Request'
    await api.get(`/api/lists/${invalidId}`).expect(400);
  });
});

describe('deleting lists', () => {
  test('a list can be deleted', async () => {
    const listsAtStart = await helper.getLists();
    const listToDelete = listsAtStart[0];

    // Server should return '204 No Content'
    await api.delete(`/api/lists/${listToDelete.id}`).expect(204);

    // Verify the database has one less list
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length - 1);

    // Verify we deleted list's name has been removed
    const names = listsAtEnd.map((l) => l.name);
    expect(names).not.toContain(listToDelete.name);
  });

  test("deleting list with non-existing id doesn't do anything", async () => {
    const nonExistingId = helper.nonExistingId();

    // Server should still return '204 No Content' even if nothing happens
    await api.delete(`/api/lists/${nonExistingId}`).expect(204);

    // No lists should have been harmed in the making of this request
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length);
  });
});

// TODO: Add tests for updating a list

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
