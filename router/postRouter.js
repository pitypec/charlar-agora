import express from 'express';
import passport from 'passport';
import passportconf from '../middleware/passport.js';
import {
  createPost,
  getAllPost,
  likePost,
  deletePost,
  createComment,
  deleteComment,
  getComment,
  getPost,
  getUserPost,
  getComments
} from '../controller/postController.js';

const router = express.Router();

router.route('/posts').get(getAllPost);

router
  .route('/post')
  .post(passport.authenticate('jwt', { session: false }), createPost);
router
  .route('/post/:userId/posts')
  .get(passport.authenticate('jwt', { session: false }), getUserPost);
router
  .route('/post/:postId')
  .get(passport.authenticate('jwt', { session: false }), getPost)
  .put(passport.authenticate('jwt', { session: false }), likePost)
  .delete(passport.authenticate('jwt', { session: false }), deletePost);
router
  .route('/post/:postId/comment')
  .post(passport.authenticate('jwt', { session: false }), createComment);
router
  .route('/post/:postId/comments')
  .get(passport.authenticate('jwt', { session: false }), getComments);
router
  .route('/post/:postId/comment/:commentId')
  .get(passport.authenticate('jwt', { session: false }), getComment)
  .delete(passport.authenticate('jwt', { session: false }), deleteComment);

export default router;
