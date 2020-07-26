const mongoose = require('mongoose');
const List = require('../models/list');

const initialLists = [
  {
    name: 'Books to Read',
  },
  {
    name: 'Groceries',
  },
];

const getLists = async () => {
  const lists = await List.find({});
  return lists.map((list) => list.toJSON());
};

// Returns a valid id that is not associated with any document
const nonExistingId = () => mongoose.Types.ObjectId();

module.exports = { initialLists, getLists, nonExistingId };
