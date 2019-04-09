// check if there is a token attached to the request AND if it's valid
const jwt = require("jsonwebtoken");

// any middleware is just a function executing on the incoming request
module.exports = (req, res, next) => {
  try {
    // get the token and store it on a constant
    // here we split to pass the first word 'Bearer' frequently used
    const token = req.headers.authorization.split(" ")[1];
    // verify if it's the right package created from the server (with the secret words)
    jwt.verify(token, 'secret_this_should_be_longer');
    // if there is no error (is a valid token), continue with the execution
    next()
  } catch (error) {
    res.status(401).json({
      message: "Auth failed!"
    })
  }

}
