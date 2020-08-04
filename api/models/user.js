const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Show the queries being sent to the database
mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true, // Optimise username for database lookups
    trim: true,
    minlength: [4, 'Username must be at least 4 characters long'],
    maxlength: [32, 'Username cannot be longer than 32 characters'],
  },
  passwordHash: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
});

// Ensure usernames are unique
userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    /* eslint-disable no-param-reassign */
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    // The passwordHash should not be revealed to the client
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);
