const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, require: true },
  title: { type: String, require: true },
  author: { type: String },
  imageUrl: { type: String },
  year: { type: String },
  genre: { type: String },
  ratings: [
    {
      userId: { type: String },
      rating: { type: String },
    },
  ],
  averageRating: { type: String },
});

module.exports = mongoose.model('Book', bookSchema);
