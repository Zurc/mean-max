const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://cruz:XTcvkR8hRGu2f5UJ@cluster0-595il.mongodb.net/node-angular?retryWrites=true')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*"); // any domain allowed to access our resources
  res.setHeader(
    "Access-Control-Allow-Headers", // restrict to certain domains
    "Origin, X-Requested-With, Content-Type, Accept"  // the incoming request might have this headers
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {
      id: 'lkajsdlfkjahs',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'hdfoiuhersj',
      title: 'Second server-side post',
      content: 'This is coming from the server!'
    }
  ]
  res.status(200).json({
    message: 'Posts fetched succesfully',
    posts: posts
  });
});

module.exports = app;

