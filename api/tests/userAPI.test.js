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
    passwordHash: helper.getPasswordHash(),
  });
  await user.save();

  // Create two lists for the user
  const listOne = new List({ ...helper.initialLists[0], user: user._id });
  await listOne.save();

  const listTwo = new List({ ...helper.initialLists[1], user: user._id });
  await listTwo.save();

  // Add two tasks to listOne, and one to listTwo
  const taskOne = new Task({ ...helper.initialTasks[0], list: listOne._id });
  await taskOne.save();

  const taskTwo = new Task({ ...helper.initialTasks[1], list: listOne._id });
  await taskTwo.save();

  const taskThree = new Task({ ...helper.initialTasks[2], list: listTwo._id });
  await taskThree.save();
});

describe('fetching a user', () => {
  test('fetching a user also fetches their lists and tasks', async () => {
    // Get the user from the database for its id
    const userFromDatabase = await User.findOne();

    const response = await api
      .get(`/api/users/${userFromDatabase._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // We only want the JSON content returned from the server
    const userFromApi = response.body;

    // Verify the user has the right number of lists
    expect(userFromApi.lists).toHaveLength(helper.initialLists.length);

    // Verify the user's first list has the right number of tasks
    expect(userFromApi.lists[0].tasks).toHaveLength(2);

    // Lists were saved to the user properly
    const userLists = userFromApi.lists;
    const listNames = userLists.map((l) => l.name);
    expect(listNames).toContain(helper.initialLists[0].name);

    // Tasks were saved to the list properly, and are accessible
    const userTasks = userFromApi.lists[0].tasks;
    const taskTexts = userTasks.map((t) => t.text);
    expect(taskTexts).toContain(helper.initialTasks[0].text);
  });

  test('fetching a user with a non-existing id returns an error', async () => {
    const nonExistingId = helper.nonExistingId();

    await api.get(`/api/users/${nonExistingId}`).expect(404);
  });

  test('fetching a user with an invalid id returns an error', async () => {
    const invalidId = 1;

    await api.get(`/api/users/${invalidId}`).expect(400);
  });
});

describe('creating a new user', () => {
  test('a valid user can be created', async () => {
    const newUser = {
      username: 'mj23',
      password: 'bulls123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('user is rejected if password is too short or too long', async () => {
    const tooShort = {
      username: 'aardvark',
      password: 'apples',
    };

    // Password must be at least 8 characters, reject
    await api.post('/api/users').send(tooShort).expect(400);

    const tooLong = {
      username: 'takeTwo',
      password:
        'rhaerhga4nta34yt3i4nyai4yna4ylia4nyai34yani4yan4ginalgbalin43gina4ngal4igali34gnaiw4ginalw4gnizbv48t23tlkefnwei23i8gz4g425ni14i2i',
    };

    // Password must be 128 characters or less, reject
    await api.post('/api/users').send(tooLong).expect(400);
  });

  test('user with no username is not created', async () => {
    const noUsername = {
      password: 'password123',
    };

    // Username must be provided
    await api.post('/api/users').send(noUsername).expect(400);
  });

  test('user is rejected if username is too long or too short', async () => {
    const tooShort = {
      username: 'ben',
      password: 'vbv2a4g23t246g',
    };

    // Username must be at least 4 characters
    await api.post('/api/users').send(tooShort).expect(400);

    const tooLong = {
      username: 'extremelyLongCamelCasedUsernameThatWillBeRejected',
      password: 'password1',
    };

    // Username cannot exceed 32 characters
    await api.post('/api/users').send(tooLong).expect(400);
  });

  test('non-unique username is rejected', async () => {
    const nonUnique = {
      username: 'mike',
      password: 'bulls1234',
    };

    // 'mike' is the username used for the user created in beforeEach()
    await api.post('/api/users').send(nonUnique).expect(400);
  });
});

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close());
