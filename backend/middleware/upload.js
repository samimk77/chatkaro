const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    let resource_type = 'auto';

    return {
      folder: 'chat_uploads',
      resource_type: resource_type,
      // allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'pdf', 'docx', 'txt'], // optional restriction
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
