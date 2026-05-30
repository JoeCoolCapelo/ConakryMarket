const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'conakrymarket/preuves',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf']
  }
});

const uploadPreuve = multer({ storage: storage });

module.exports = uploadPreuve;
