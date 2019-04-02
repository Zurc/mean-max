const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

// posts POST request (create posts)
router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update succesful!'});
  });
});

// posts GET request (fetch posts)
router.get('',(req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: documents
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) { // if post exists
      res.status(200).json(post);
    } else {  // if post does NOT exists
      res.status(404).json({message: 'Post not found'});
    }
  })
})

// post DELETE request (delete specific post, dynamically passed id)
// :id // called dynamic segment
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    // send back a message to confirm deletion
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = router;
