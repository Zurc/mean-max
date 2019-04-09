// this allows us to construct paths to safely run on any OS
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(
  'mongodb+srv://cruz:XTcvkR8hRGu2f5UJ@cluster0-595il.mongodb.net/node-angular')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
// any req targeting /images will be forwarded to 'backend/images' and allowed to continue
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*"); // any domain allowed to access our resources
  res.setHeader(
    "Access-Control-Allow-Headers", // restrict to certain domains
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"  // the incoming request might have this headers
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

// make our main express app to be aware of our routes
// filter for requests to /api/posts/, only that ones
// will be forwarded to the postsRoutes
app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;

