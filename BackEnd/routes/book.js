const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');

router.get('/', bookCtrl.getBooks);
router.get('/bestrating', bookCtrl.getBestBooks);
router.get('/:id', bookCtrl.getOneBook);

router.post('/', auth, multer, bookCtrl.addBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

router.put('/:id', auth, multer, bookCtrl.modifyBook);

router.delete('/:id', auth, bookCtrl.delBook);

module.exports = router;
