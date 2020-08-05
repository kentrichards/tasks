const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./helper');
const User = require('../models/user');
const List = require('../models/list');
const Task = require('../models/task');

const api = supertest(app);

jest.setTimeout(10000);

// Initialize the test database before each test is run
beforeEach(async () => {
  // Wipe the database
  await User.deleteMany({});
  await List.deleteMany({});
  await Task.deleteMany({});

  // Create a user for all the lists to belong to
  const user = new User({
    username: helper.initialUser.username,
    passwordHash: helper.initialUser.passwordHash,
  });
  await user.save();

  // Create two lists for the user
  const listOne = new List({ ...helper.initialLists[0], user: user._id });
  await listOne.save();

  const listTwo = new List({ ...helper.initialLists[1], user: user._id });
  await listTwo.save();

  // Add two tasks to listOne, and one to listTwo
  const taskOne = new Task({ ...helper.initialTasks[0], list: listOne._id, user: user._id });
  await taskOne.save();

  const taskTwo = new Task({ ...helper.initialTasks[1], list: listOne._id, user: user._id });
  await taskTwo.save();

  const taskThree = new Task({ ...helper.initialTasks[2], list: listTwo._id, user: user._id });
  await taskThree.save();
});

describe('adding new lists', () => {
  test('a valid list can be added', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newList = { name: 'My New List', user: response.body.id };

    // Add new list to the database and verify it worked
    await api
      .post('/api/lists')
      .set('Authorization', `Bearer ${response.body.token}`)
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
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const invalidList = { price: 100, user: response.body.id };

    // Server should reject our request
    await api
      .post('/api/lists')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(invalidList)
      .expect(400);

    // Database should not have any new lists
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length);
  });
});

describe('deleting lists', () => {
  test('a list can be deleted', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listsAtStart = await helper.getLists();
    const listToDelete = listsAtStart[0];

    // Server should return '204 No Content'
    await api
      .delete(`/api/lists/${listToDelete.id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204);

    // Verify the database has one less list
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length - 1);

    // Verify the deleted list's name has been removed
    const names = listsAtEnd.map((l) => l.name);
    expect(names).not.toContain(listToDelete.name);
  });

  test('deleting list with non-existing id returns an error', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const nonExistingId = helper.nonExistingId();

    // Server should return '404 Not Found'
    await api
      .delete(`/api/lists/${nonExistingId}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(404);

    // No lists should have been harmed in the making of this request
    const listsAtEnd = await helper.getLists();
    expect(listsAtEnd).toHaveLength(helper.initialLists.length);
  });

  test('deleting a list deletes its tasks', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listWithTask = await List.findOne({ name: helper.initialLists[0].name });

    // There should be tasks in the database initially
    const tasksAtStart = await helper.getTasks();
    expect(tasksAtStart).toHaveLength(helper.initialTasks.length);

    const numberOfTasksToBeDeleted = listWithTask.tasks.length;

    await api
      .delete(`/api/lists/${listWithTask.id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204);

    // They should be gone after deleting the list
    const tasksAtEnd = await helper.getTasks();
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length - numberOfTasksToBeDeleted);
  });
});

describe('updating a list', () => {
  test("a list's name can be changed", async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listToUpdate = await List.findOne();
    const listUpdates = { name: 'new list name' };

    const updateResponse = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(listUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updateResponse.body.name).toEqual(listUpdates.name);
    expect(updateResponse.body.name).not.toEqual(listToUpdate.name);
  });

  test('list name cannot be set to empty string', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listToUpdate = await List.findOne();
    const emptyUpdate = { name: '' };

    const updateResponse = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(emptyUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // List name is not set to an empty string
    expect(updateResponse.body.name).toEqual(listToUpdate.name);
  });

  test('list name cannot be set to null', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listToUpdate = await List.findOne();
    const nullUpdate = { name: null };

    const updateResponse = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(nullUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // List name is not set to null
    expect(updateResponse.body.name).toEqual(listToUpdate.name);
  });

  test('user field cannot be updated', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listToUpdate = await List.findOne();
    const listUpdates = { user: loginResponse.body.id };

    const updateResponse = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(listUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // User field should not have changed
    // https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(updateResponse.body.user)).toEqual(JSON.stringify(listToUpdate.user));
  });

  test('tasks array cannot be updated', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const listToUpdate = await List.findOne();
    const listUpdates = { tasks: [] };

    const updateResponse = await api
      .put(`/api/lists/${listToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(listUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Tasks field should not have changed
    expect(updateResponse.body.tasks).not.toHaveLength(listUpdates.tasks.length);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
