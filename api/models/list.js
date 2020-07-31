const mongoose = require('mongoose');
const User = require('./user');

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

listSchema.pre('save', async function (next) {
  const userExists = await User.exists({ _id: this.user });

  if (userExists) {
    // Add the list to its parent user after it is saved
    await User.findByIdAndUpdate(this.user, { $push: { lists: this._id } });
    next();
  } else {
    next({
      message: `there is no user with id ${this.user}`,
      statusCode: 400,
    });
  }
});

// Converts ObjectId to a string to avoid issues on the frontend
// Removes document properties that aren't relevant to the client (versioning)
listSchema.set('toJSON', {
  /* eslint-disable no-param-reassign */
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('List', listSchema);
