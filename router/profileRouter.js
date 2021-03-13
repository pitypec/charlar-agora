import express from 'express';
import passport from 'passport';
import passportconf from '../middleware/passport.js';
import {
  getAllPrfoile,
  createProfile,
  getUserProfile,
  getUserFollowers
} from '../controller/profileController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllPrfoile)
  .post(passport.authenticate('jwt', { session: false }), createProfile);
router.route('/:profileId').get(getUserProfile);
router.route('/:profileId/followers').get(getUserFollowers);

export default router;
