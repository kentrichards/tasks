const mongoose = require('mongoose');

// Show the queries being sent to the database
mongoose.set('debug', true);

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Converts ObjectId to a string to avoid issues on the frontend
// Removes document properties that aren't relevant to the client (versioning)
listSchema.set('toJSON', {
  /* eslint-disable no-param-reassign */
  /* eslint-disable no-underscore-dangle */
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('List', listSchema);
