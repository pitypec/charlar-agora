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

function fileFilter(req, file, cb) {
  console.log('file filter called');

  if (file.mimetype !== 'video/mp4') {
    return cb(null, false, new Error('goes wrong on the mimetype'));
  }
  cb(null, true);
}

const multerStorage = multer({
  storage,
  filename: fileFilter
});

const cloudinaryUploader = (fieldName) => {
  const multerMW = multerStorage.array(fieldName);
  return (req, res, next) => {
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
