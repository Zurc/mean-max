const express = require('express');
const bcrypt = require("bcrypt");

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
          res.status(200).json({
            message: 'User created!',
            result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        });
    });
});

// export router
module.exports = router;
