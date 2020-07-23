// Via https://stackoverflow.com/a/13851334
// Checks that passed in strings are exactly 24 alphanumeric characters
// Does not guarantee that there is a List associated with the id
const objectIdIsValid = (id) => id.match(/^[0-9a-fA-F]{24}$/);

module.exports = objectIdIsValid;
