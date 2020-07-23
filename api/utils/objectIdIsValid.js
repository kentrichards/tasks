// Via https://stackoverflow.com/a/13851334
const objectIdIsValid = (id) => id.match(/^[0-9a-fA-F]{24}$/);

module.exports = objectIdIsValid;
