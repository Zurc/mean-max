const express = require('express');

const User = require('../models/user');

const router = express.Router();

// register routes
router.post("/signup", (req, res, next) => {
  // get email and pass from the incoming request
  const user = new User({
    email: req.body.email,
    password: req.body.password  // storing this unencrypted is BAD idea
  })
});

// export router
module.exports = router;
