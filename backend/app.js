const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('First middleware');
  next(); // call next if you don't send a response
});

app.use((req, res, next) => {
  res.send('Hello from express');
});

module.exports = app;

