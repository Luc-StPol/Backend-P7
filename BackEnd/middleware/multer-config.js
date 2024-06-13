const multer = require('multer');
const SharpMulter = require('sharp-multer');

const fileName = (og_filename, options) => {
  const name = og_filename.split(' ').join('_');
  const extension = options.fileFormat;
  const newFileName = name + Date.now() + '.' + extension;
  return newFileName;
};

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: fileName,
  imageOPtions: {
    fileFormat: 'png',
    quality: 80,
    resize: { width: 500, height: 500 },
  },
});

module.exports = multer({ storage: storage }).single('image');
