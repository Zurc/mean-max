const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const router = express.Router();

// register routes
router.post("/signup", (req, res, next) => {
  // hash the pass for security
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  // find the saved user that matches this user email from the request
  User.findOne({ email: req.body.email })
    .then(user => {
      // if you cannot find it return failed message and status
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user
      // compare that both hashes are the same
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      // if they don't return failed message and status
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      // if it's a valid user create and configure a token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
      // send the response
      res.status(200).json({
        token: token
      })
    })
    // catch any error and send response with message and status
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      })
    })

})

// export router
module.exports = router;
