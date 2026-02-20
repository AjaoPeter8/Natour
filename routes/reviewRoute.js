import express from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  updateTourAndId,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

//Accessible to only logged in users
router.use(protect);

router.route('/').get(getAllReviews).post(restrictTo('user'), updateTourAndId, createReview);
router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

export default router;
