import express from 'express';
import passport from 'passport';
import passportConf from '../middleware/passport.js';
import cloudinaryUploader from '../middleware/cloudinarySingle.js';
import cloudinaryMultiple from '../middleware/cloudinaryMultiple.js';
import cloudinaryAvatar from '../middleware/cloudinaryAvatar.js';
import {
  upload,
  destroy,
  uploadMultiple,
  uploadAvatar
} from '../controller/uploadController.js';

const router = express.Router();

router.route('/upload').post(cloudinaryUploader('image'), upload);
router
  .route('/destroy')
  .post(passport.authenticate('local', { session: false }), destroy);

router
  .route('/upload_multiple')
  .post(cloudinaryMultiple('image'), uploadMultiple);
router.route('/upload_avatar').post(cloudinaryAvatar('image'), uploadAvatar);

export default router;
