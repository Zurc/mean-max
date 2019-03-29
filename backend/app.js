const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*"); // any domain allowed to access our resources
  res.setHeader(
    "Access-Control-Allow-Headers", // restrict to certain domains
    "Origin, X-Requested-With, Content-Type, Accept"  // the incoming request might have this headers
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

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

