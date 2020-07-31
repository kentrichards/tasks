const mongoose = require('mongoose');
const List = require('./list');

// Show the queries being sent to the database
mongoose.set('debug', true);

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  important: {
    type: Boolean,
    default: false,
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
});

taskSchema.pre('save', async function (next) {
  const listExists = await List.exists({ _id: this.list });

  if (!listExists) {
    next({
      message: `there is no list with id ${this.list}`,
      statusCode: 400,
    });

    return;
  }

  next();
});

taskSchema.post('save', async function (document, next) {
  // Add the task to its parent list after it is saved
  await List.findByIdAndUpdate(document.list, { $push: { tasks: document._id } });
  next();
});

// Converts ObjectId to a string to avoid issues on the frontend
// Removes document properties that aren't relevant to the client (versioning)
taskSchema.set('toJSON', {
  /* eslint-disable no-param-reassign */
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Task', taskSchema);
