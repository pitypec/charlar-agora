import cloudinary from '../config/cloudinary.js';
export const upload = (req, res, next) => {
  try {
    console.log(req);
    if (!req.file || Object.keys(req.file) === 0) {
      return res.status(400).json({ msg: 'No file selected' });
    }
    console.log(req.file);
    const image = {};
    image.secure_url = req.file.path;
    image.public_id = req.file.filename;
    return res.status(200).json(image);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
export const uploadAvatar = (req, res, next) => {
  try {
    console.log(req);
    if (!req.file || Object.keys(req.file) === 0) {
      return res.status(400).json({ msg: 'No file selected' });
    }
    console.log(req.file);
    const image = {};
    image.secure_url = req.file.path;
    image.public_id = req.file.filename;
    return res.status(200).json(image);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
export const uploadMultiple = (req, res, next) => {
  console.log(req);
  try {
    if (!req.files || Object.keys(req.files) === 0) {
      return res.status(400).json({ msg: 'No file selected' });
    }
    const images = req.files;
    const image = [];
    for (let i = 0; i < images.length; i++) {
      console.log(images[i]);
      const img = {
        secure_url: images[i].path,
        public_id: images[i].filename
      };
      image.push(img);
    }

    return res.status(200).json(image);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
export const destroy = (req, res, next) => {
  try {
    const result = cloudinary.uploader.destroy(req.body.public_id, {
      folder: 'test'
    });
    if (result) {
      return res.status(200).json({ msg: 'image deleted successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
