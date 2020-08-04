const mongoose = require('mongoose');
const List = require('../models/list');
const Task = require('../models/task');

const initialLists = [
  {
    name: 'Books to Read',
  },
  {
    name: 'Groceries',
  },
];

const initialTasks = [
  {
    text: 'Catch-22',
    completed: true,
    important: false,
  },
  {
    text: 'Outliers',
    completed: false,
    important: false,
  },
  {
    text: 'Whole grain bagels',
    completed: false,
    important: false,
  },
];

const getLists = async () => {
  const lists = await List.find({});
  return lists.map((list) => list.toJSON());
};

const getTasks = async () => {
  const tasks = await Task.find({});
  return tasks.map((task) => task.toJSON());
};

// Returns a valid id that is not associated with any document
const nonExistingId = () => mongoose.Types.ObjectId();

// Returns a valid password hash, no need to generate one on demand
const getPasswordHash = () => '$2b$10$CUMRgmbATfxC2xWInbZ8pOFTDrurjBtOq4s09H6sbqTzZt4ign9Cu';

module.exports = { initialLists, initialTasks, getLists, getTasks, nonExistingId, getPasswordHash };
