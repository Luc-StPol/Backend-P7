const Book = require('../models/Book');
const fs = require('fs');

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne(req.params._id)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.staus(400).json({ error }));
};

exports.getBestBooks = (req, res, next) => {};

exports.addBook = (req, res, next) => {
  const imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  const book = new Book({
    ...JSON.parse(req.body.book),
    imageUrl: imgUrl,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: 'Book added' }))
    .catch((error) => res.staus(400).json({ error }));
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
        console.log(filename);
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Book deleted' }))
            .catch((error) => res.staus(401).json({ error }));
        });
      }
    })
    .catch((error) => res.staus(500).json({ error }));
};

exports.rateBook = (req, res, next) => {};
