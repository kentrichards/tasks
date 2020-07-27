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

describe('adding new tasks', () => {
  test('a valid task can be added', async () => {
    const newTask = {
      text: 'what i want to do today',
      important: true,
      listId: helper.initialTasks[0].listId,
    };

    // Add new task to the database and verify it worked
    await api
      .post('/api/tasks')
      .send(newTask)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // We should have more tasks than we started with
    const tasksAtEnd = await helper.getTasks();
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length + 1);

    // The new task should have the correct text
    const texts = tasksAtEnd.map((t) => t.text);
    expect(texts).toContain(newTask.text);
  });

  test('invalid task is not added', async () => {
    const invalidTask = { content: 'wrong format' };

    // Server should reject our request
    await api.post('/api/tasks').send(invalidTask).expect(400);

    // Database should not have any new tasks
    const tasksAtEnd = await helper.getTasks();
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length);
  });
});

describe('fetching one task', () => {
  test('a specific task can be retrieved', async () => {
    const tasksAtStart = await helper.getTasks();
    const taskToView = tasksAtStart[0];

    const resultTask = await api
      .get(`/api/tasks/${taskToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Don't check for full equality because of the date field
    expect(resultTask.body.id).toEqual(taskToView.id);
    expect(resultTask.body.text).toEqual(taskToView.text);
    // https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(resultTask.body.listId)).toEqual(JSON.stringify(taskToView.listId));
  });

  test('fetching a task with a non-existing id returns an error', async () => {
    const nonExistingId = helper.nonExistingId();

    // Server should return '404 Not Found', because the request was valid
    await api.get(`/api/tasks/${nonExistingId}`).expect(404);
  });

  test('fetching a task with an invalid id returns an error', async () => {
    const invalidId = 1;

    // Server should return '400 Bad Request'
    await api.get(`/api/tasks/${invalidId}`).expect(400);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
