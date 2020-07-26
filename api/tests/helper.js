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

module.exports = { initialLists, getLists };
