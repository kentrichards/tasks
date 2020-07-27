const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Task = require('../models/task');
const helper = require('./helper');

const api = supertest(app);

// Initialize the test database before each test is run
beforeEach(async () => {
  // Wipe the database
  await Task.deleteMany({});

  // Re-populate the database using initialTasks
  const promises = [];
  helper.initialTasks.forEach((task) => promises.push(new Task(task).save()));

  await Promise.all(promises);
});

describe('fetching all tasks', () => {
  test('tasks are returned as json', async () => {
    await api
      .get('/api/tasks')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all tasks are returned', async () => {
    const response = await api.get('/api/tasks');
    expect(response.body).toHaveLength(helper.initialTasks.length);
  });

  test('task text is saved on upload', async () => {
    const response = await api.get('/api/tasks');

    // Save each task's text
    const texts = response.body.map((r) => r.text);

    // Check that the task text we are looking for exists
    expect(texts).toContain(helper.initialTasks[0].text);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
