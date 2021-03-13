import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import pkg from 'multer-storage-cloudinary';

const { CloudinaryStorage } = pkg;
const config = process.env.CLOUDINARY_URL;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_AVATAR_FOLDER,
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const multerStorage = multer({ storage });

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
