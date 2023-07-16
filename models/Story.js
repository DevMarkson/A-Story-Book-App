const mongoose = require('mongoose');

function removeComma(genre) {
  if (Array.isArray(genre)) {
    return genre.join(' ');
  }
  return genre;
}

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  genre: { 
    type: [String],
    required: false,
    default: '',
    set: removeComma,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Story', StorySchema);
