const mongoose = require('mongoose')

// Show the queries being sent to the database
// mongoose.set('debug', true)

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  important: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  }
})

taskSchema.pre('save', async function (next) {
  const listExists = await this.model('List').exists({ _id: this.list })

  if (listExists) {
    // Add the task to its parent list after it is saved
    await this.model('List').updateOne(
      { _id: this.list },
      { $push: { tasks: this._id } }
    )
  } else {
    next({
      message: `there is no list with id ${this.list}`,
      statusCode: 404
    })
  }
})

taskSchema.pre('remove', async function () {
  // Remove the task from the List.tasks array it was part of
  await this.model('List').updateOne(
    { _id: this.list },
    { $pull: { tasks: this._id } }
  )
})

// Converts ObjectId to a string to avoid issues on the frontend
// Removes document properties that aren't relevant to the client (versioning)
taskSchema.set('toJSON', {
  /* eslint-disable no-param-reassign */
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)
