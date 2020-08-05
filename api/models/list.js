const mongoose = require('mongoose');

// Show the queries being sent to the database
// mongoose.set('debug', true);

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
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

listSchema.pre('save', async function (next) {
  const userExists = await this.model('User').exists({ _id: this.user });

  if (userExists) {
    // Add the list to its parent user after it is saved
    await this.model('User').updateOne({ _id: this.user }, { $push: { lists: this._id } });
  } else {
    next({
      message: `there is no user with id ${this.user}`,
      statusCode: 404,
    });
  }
});

listSchema.pre('remove', async function () {
  // Remove the list's id from the User.lists array it was in
  await this.model('User').updateOne({ _id: this.user }, { $pull: { lists: this._id } });

  // Remove all of the tasks that were on the list
  await this.model('Task').deleteMany({ list: this._id });
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
