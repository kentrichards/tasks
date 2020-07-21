const mongoose = require('mongoose');

// Show the queries being sent to the database
mongoose.set('debug', true);

// Required for 'findByIdAndUpdate()'
mongoose.set('useFindAndModify', true);

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
    type: mongoose.ObjectId,
    required: true,
  },
});

// Converts ObjectId to a string to avoid issues on the frontend
// Removes document properties that aren't relevant to the client (versioning)
taskSchema.set('toJSON', {
  /* eslint-disable no-param-reassign */
  /* eslint-disable no-underscore-dangle */
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Task', taskSchema);
