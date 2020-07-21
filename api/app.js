const express = require('express');

const app = express();

app.get('/', (_req, res) => {
  res.send('hello world!');
});

module.exports = app;
