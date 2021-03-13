import express from 'express';
import passport from 'passport';
import passportconf from '../middleware/passport.js';
import {
  validateBody,
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  forgotPasswordSchema
} from '../middleware/validate.js';
import {
  activateEmail,
  createUser,
  getAllUsers,
  loginUser,
  getAccessToken,
  forgetPassword,
  resetPassword,
  logout,
  getUserProfile,
  createUserProfile,
  getUserInfo
} from '../controller/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/signup').post(validateBody(signUpSchema), createUser);
router.route('/activate').post(activateEmail);
router
  .route('/signin')
  .post(
    validateBody(signInSchema),
    passport.authenticate('local', { session: false }),
    loginUser
  );
router.route('/refresh_token').get(getAccessToken);

router
  .route('/forgot')
  .post(validateBody(forgotPasswordSchema), forgetPassword);
router
  .route('/reset')
  .post(
    validateBody(resetPasswordSchema),
    passport.authenticate('jwt', { session: false }),
    resetPassword
  );
router.route('/logout').get(logout);
router
  .route('/userinfo')
  .get(passport.authenticate('jwt', { session: false }), getUserInfo);
router.route('/:userId/profile').get(getUserProfile).post(createUserProfile);

export default router;
