const mongoose = require('mongoose');

// create your schema, a blueprint for how your data should look like
const postSchema = mongoose.Schema({
  // BE is Capital for type!!!
  title: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
