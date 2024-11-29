const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  category: { type: String },
  date: { type: String },
  author: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogSchema);