const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./helper');
const User = require('../models/user');
const List = require('../models/list');
const Task = require('../models/task');

const api = supertest(app);

// Initialize the test database before each test is run
beforeEach(async () => {
  // Wipe the database
  await User.deleteMany({});
  await List.deleteMany({});
  await Task.deleteMany({});

  // Create a user for all the lists to belong to
  const user = new User({
    username: 'mike',
    passwordHash: '$2b$10$CUMRgmbATfxC2xWInbZ8pOFTDrurjBtOq4s09H6sbqTzZt4ign9Cu',
  });
  await user.save();

  // Re-populate the database using initialLists and user id
  const promises = [];
  helper.initialLists.forEach((list) => {
    const newList = new List({ ...list, user: user._id });
    promises.push(newList.save());
  });

  await Promise.all(promises);

  // Add a task to the first list
  const list = await List.findOne({ name: helper.initialLists[0].name });

  const newTask = new Task({ text: 'test task', list: list._id });
  await newTask.save();
});

describe('adding new lists', () => {
  test('a valid list can be added', async () => {
    // Get the user who all the lists belong to
    const user = await User.findOne();

    const newList = { name: 'My New List', user: user._id };

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

describe('deleting lists', () => {
  test('a list can be deleted', async () => {
    const listsAtStart = await helper.getLists();
    const listToDelete = listsAtStart[0];

    // Server should return '204 No Content'
    await api.delete(`/api/lists/${listToDelete.id}`).expect(204);

    // Verify the database has one less list
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length - 1);

    // Verify the deleted list's name has been removed
    const names = listsAtEnd.map((l) => l.name);
    expect(names).not.toContain(listToDelete.name);
  });

  test('deleting list with non-existing id returns an error', async () => {
    const nonExistingId = helper.nonExistingId();

    // Server should return '404 Not Found'
    await api.delete(`/api/lists/${nonExistingId}`).expect(404);

    // No lists should have been harmed in the making of this request
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length);
  });

  test('deleting a list deletes its tasks', async () => {
    const listWithTask = await List.findOne({ name: helper.initialLists[0].name });

    // There should be tasks in the database initially
    const tasksAtStart = await helper.getTasks();
    expect(tasksAtStart).toHaveLength(1);

    await api.delete(`/api/lists/${listWithTask.id}`);

    // They should be gone after deleting the list
    const tasksAtEnd = await helper.getTasks();
    expect(tasksAtEnd).toHaveLength(0);
  });
});

describe('updating a list', () => {
  test("a list's name can be changed", async () => {
    const listToUpdate = await List.findOne();
    const listUpdates = { name: 'new list name' };

    const response = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .send(listUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toEqual(listUpdates.name);
    expect(response.body.name).not.toEqual(listToUpdate.name);
  });

  test('list name cannot be set to empty string', async () => {
    const listToUpdate = await List.findOne();
    const emptyUpdate = { name: '' };

    const response = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .send(emptyUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // List name is not set to an empty string
    expect(response.body.name).toEqual(listToUpdate.name);
  });

  test('list name cannot be set to null', async () => {
    const listToUpdate = await List.findOne();
    const nullUpdate = { name: null };

    const response = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .send(nullUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // List name is not set to null
    expect(response.body.name).toEqual(listToUpdate.name);
  });

  test('user field cannot be updated', async () => {
    const listToUpdate = await List.findOne();
    const listUpdates = { user: helper.nonExistingId() };

    const response = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .send(listUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // User field should not have changed
    // https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(response.body.user)).toEqual(JSON.stringify(listToUpdate.user));
  });

  test('tasks array cannot be updated', async () => {
    const listToUpdate = await List.findOne();
    const listUpdates = { tasks: [] };

    const response = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .send(listUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Tasks field should not have changed
    expect(response.body.tasks).not.toHaveLength(listUpdates.tasks.length);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
