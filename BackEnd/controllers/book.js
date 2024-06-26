const Book = require('../models/Book');
const fs = require('fs');

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((topBooks) => {
      res.status(200).json(topBooks);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.addBook = (req, res, next) => {
  const imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  const book = new Book({
    ...JSON.parse(req.body.book),
    imageUrl: imgUrl,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: 'Book added' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.userId != req.auth.userId) {
      res.status(400).json({ message: 'Not authorized' });
    } else {
      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {});
      }
      Book.updateOne(req.params._id, { ...bookObject })
        .then(() => res.status(200).json({ message: 'book modify' }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

exports.delBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(400).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Book deleted' }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const rating = book.ratings.find(({ userId }) => userId === req.body.userId);
      if (rating) {
        res.status(400).json({ message: 'book already rated' });
      } else {
        book.ratings.push({ ...req.body });
        const totalRatings = book.ratings.length;
        const sumRatings = book.ratings.reduce((a, b) => a + parseInt(b.rating), 0);
        book.averageRating = (sumRatings / totalRatings).toFixed(0);
        book.save();
        res.status(200).json(book);
      }
    })

    .catch((error) => res.status(400).json({ error }));
};
