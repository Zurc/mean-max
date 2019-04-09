const mongoose = require('mongoose');

// create your schema, a blueprint for how your data should look like
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

module.exports = mongoose.model('User', postSchema);
