import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import pkg from 'multer-storage-cloudinary';

const { CloudinaryStorage } = pkg;
const config = process.env.CLOUDINARY_URL;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER,
    allowedFormats: ['jpg', 'png', 'mp4']
  }
});

const multerStorage = multer({
  storage,
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'video/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'video/mp4') {
      filetype = 'mp4';
    }
    if (file.mimetype === 'video/ogg') {
      filetype = 'ogg';
    }
    if (file.mimetype === 'video/wmv') {
      filetype = 'wmv';
    }
    if (file.mimetype === 'video/x-flv') {
      //filetype = mime.getExtension('video/flv');
      filetype = 'flv';
    }
    if (file.mimetype === 'video/avi') {
      filetype = 'avi';
    }
    if (file.mimetype === 'video/webm') {
      filetype = 'webm';
    }
    if (file.mimetype === 'video/mkv') {
      filetype = 'mkv';
    }
    if (file.mimetype === 'video/avchd') {
      filetype = 'avchd';
    }
    if (file.mimetype === 'video/mov') {
      filetype = 'mov';
    }
    cb(null, 'video-' + Date.now() + '.' + filetype);
  }
});

const cloudinaryUploader = (fieldName) => {
  const multerMW = multerStorage.single(fieldName);
  return (req, res, next) => {
    console.log(req);
    try {
      multerMW(req, res, (error) => {
        if (error) {
          console.log(error);
          if (error.message.indexOf('file format') >= 0) {
            return next('Invalid file format. Only gif images allowed');
          }
          return next(error);
        }
        return next();
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

export default cloudinaryUploader;
