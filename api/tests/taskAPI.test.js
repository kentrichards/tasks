const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const User = require('../models/user')
const List = require('../models/list')
const Task = require('../models/task')

const api = supertest(app)

jest.setTimeout(10000)

// Initialize the test database before each test is run
beforeEach(async () => {
  // Wipe the database
  await User.deleteMany({})
  await List.deleteMany({})
  await Task.deleteMany({})

  // Create a user for all the lists to belong to
  const user = new User({
    username: helper.initialUser.username,
    passwordHash: helper.initialUser.passwordHash
  })
  await user.save()

  // Create two lists for the user
  const listOne = new List({ ...helper.initialLists[0], user: user._id })
  await listOne.save()

  const listTwo = new List({ ...helper.initialLists[1], user: user._id })
  await listTwo.save()

  // Add two tasks to listOne, and one to listTwo
  const taskOne = new Task({
    ...helper.initialTasks[0],
    list: listOne._id,
    user: user._id
  })
  await taskOne.save()

  const taskTwo = new Task({
    ...helper.initialTasks[1],
    list: listOne._id,
    user: user._id
  })
  await taskTwo.save()

  const taskThree = new Task({
    ...helper.initialTasks[2],
    list: listTwo._id,
    user: user._id
  })
  await taskThree.save()
})

describe('adding new tasks', () => {
  test('a valid task can be added', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const listObject = await List.findOne()

    const newTask = {
      text: 'what i want to do today',
      important: true,
      list: listObject.id,
      user: response.body.id
    }

    // Add new task to the database and verify it worked
    await api
      .post('/api/tasks')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(newTask)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // We should have more tasks than we started with
    const tasksAtEnd = await helper.getTasks()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length + 1)

    // The new task should have the correct text
    const texts = tasksAtEnd.map(t => t.text)
    expect(texts).toContain(newTask.text)
  })

  test('invalid task is not added', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const invalidTask = { content: 'wrong format' }

    // Server should reject our request
    await api
      .post('/api/tasks')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(invalidTask)
      .expect(400)

    // Database should not have any new tasks
    const tasksAtEnd = await helper.getTasks()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length)
  })

  test("cannot add task to list that doesn't exist", async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskWithNonExistingList = {
      text: 'buy a puppy',
      list: helper.nonExistingId(),
      user: response.body.id
    }

    await api
      .post('/api/tasks')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(taskWithNonExistingList)
      .expect(404)

    // Database should not have added our task
    const tasksAtEnd = await helper.getTasks()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length)

    const texts = tasksAtEnd.map(t => t.text)
    expect(texts).not.toContain(taskWithNonExistingList.text)
  })
})

describe('deleting tasks', () => {
  test('a task can be deleted', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const tasksAtStart = await helper.getTasks()
    const taskToDelete = tasksAtStart[0]

    // Server should return '204 No Content'
    await api
      .delete(`/api/tasks/${taskToDelete.id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204)

    // Verify the database has one less task
    const tasksAtEnd = await helper.getTasks()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length - 1)

    // Verify the deleted task's text has been removed
    const texts = tasksAtEnd.map(t => t.text)
    expect(texts).not.toContain(taskToDelete.text)
  })

  test('deleting task with non-existing id returns an error', async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const nonExistingId = helper.nonExistingId()

    // Server should return '404 Not Found'
    await api
      .delete(`/api/tasks/${nonExistingId}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(404)

    // No tasks should have been harmed in the making of this request
    const tasksAtEnd = await helper.getTasks()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length)
  })

  test("deleting a task removes it from it's parent list", async () => {
    // Login as the user we created above
    const response = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Get a random task from the parent list
    const listAtStart = await List.findOne()
    const taskToDelete = listAtStart.tasks[0]

    await api
      .delete(`/api/tasks/${taskToDelete}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204)

    // Verify the task was deleted
    const tasksAtEnd = await helper.getTasks()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length - 1)

    // Verify the task's id was removed from the list
    const listAtEnd = await List.findById(listAtStart.id)

    expect(listAtEnd.tasks).not.toContain(taskToDelete)
    expect(listAtEnd.tasks).toHaveLength(listAtStart.tasks.length - 1)
  })
})

describe('updating a task', () => {
  test("a task's name can be changed", async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskToUpdate = await Task.findOne()
    const taskUpdates = { text: 'new task text' }

    const response = await api
      .put(`/api/tasks/${taskToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(taskUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.text).toEqual(taskUpdates.text)
    expect(response.body.text).not.toEqual(taskToUpdate.text)
  })

  test('important and completed fields can be updated', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskToUpdate = await Task.findOne()

    const importantAtStart = taskToUpdate.important
    const completedAtStart = taskToUpdate.completed

    // Flip the 'important' and 'completed' fields
    const taskUpdates = {
      important: !importantAtStart,
      completed: !completedAtStart
    }

    const response = await api
      .put(`/api/tasks/${taskToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(taskUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.important).toEqual(!importantAtStart)
    expect(response.body.completed).toEqual(!completedAtStart)
  })

  test('list field cannot be updated', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskToUpdate = await Task.findOne()
    const taskUpdates = { list: helper.nonExistingId() }

    const response = await api
      .put(`/api/tasks/${taskToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(taskUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Nothing should have changed
    // https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(response.body.list)).toEqual(
      JSON.stringify(taskToUpdate.list)
    )
  })

  test('boolean fields cannot be set to null', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskToUpdate = await Task.findOne()
    const taskUpdates = { important: null, completed: null }

    const response = await api
      .put(`/api/tasks/${taskToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(taskUpdates)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Nothing should have changed
    expect(response.body.important).toEqual(taskToUpdate.important)
    expect(response.body.completed).toEqual(taskToUpdate.completed)
  })

  test('task text cannot be set to empty string', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskToUpdate = await Task.findOne()
    const emptyUpdate = { text: '' }

    const response = await api
      .put(`/api/tasks/${taskToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(emptyUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Task text is not set to an empty string
    expect(response.body.text).toEqual(taskToUpdate.text)
  })

  test('task text cannot be set to null', async () => {
    // Login as the user we created above
    const loginResponse = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const taskToUpdate = await Task.findOne()
    const nullUpdate = { text: null }

    const response = await api
      .put(`/api/tasks/${taskToUpdate._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(nullUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Task text is not set to null
    expect(response.body.text).toEqual(taskToUpdate.text)
  })
})

// Clean-up when all tests have finished running
afterAll(() => mongoose.connection.close())
