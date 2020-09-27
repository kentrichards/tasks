const wrapAsync = require('../middleware/wrapAsync')
const Task = require('../models/task')

const createTask = wrapAsync(async (request, response) => {
  const newTask = new Task({ ...request.body, user: request.user._id })
  const result = await newTask.save()

  // Returns '201 Created' on success
  response.status(201).json(result)
})

const deleteTask = wrapAsync(async (request, response, next) => {
  const taskToRemove = await Task.findById(request.params.id)

  if (!taskToRemove) {
    next({
      message: `cannot find task with id ${request.params.id} to delete`,
      statusCode: 404
    })

    return
  }

  await taskToRemove.remove()

  response.json(taskToRemove._id)
})

const updateTask = wrapAsync(async (request, response) => {
  const updatedTask = {}

  // Only allow updating of 'text', 'important', and 'completed' fields
  const { text, important, completed } = request.body

  if (text) {
    updatedTask.text = text
  }

  if (important !== null && important !== undefined) {
    updatedTask.important = important
  }

  if (completed !== null && completed !== undefined) {
    updatedTask.completed = completed
  }

  // { new: true } tells Mongoose to return the updated list, not the original
  const result = await Task.findByIdAndUpdate(request.params.id, updatedTask, {
    new: true
  })

  response.json(result)
})

module.exports = { createTask, deleteTask, updateTask }
