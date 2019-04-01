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
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

// posts POST request (create posts)
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

// posts GET request (fetch posts)
app.get('/api/posts',(req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: documents
      });
    });
});

// post DELETE request (delete specific post, dynamically passed id)
// :id // called dynamic segment
app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    // send back a message to confirm deletion
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = app;

