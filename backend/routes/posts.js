const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

// helper to map mimetypes and file extensions
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    // the path here is relative to the server.js file
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// posts POST request (create posts)
// pass multer as another param (middleware)
router.post('', multer({storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        // create the post with all the previous props + imagePath
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.put('/:id', multer({storage}).single("image"),
(req, res, next) => {
	let imagePath = req.body.imagePath;
	if (req.file) {
		const url = req.protocol + '://' + req.get("host");
		imagePath = url + "/images/" + req.file.filename
	};
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
		content: req.body.content,
		imagePath: imagePath
	});
	console.log(post);
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update succesful!'});
  });
});

// posts GET request (fetch posts)
router.get('',(req, res, next) => {
  // convert this params to numbers (add + sign)
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    }).then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
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
