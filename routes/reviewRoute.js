import express from 'express';
import { getAllReviews,getReview, createReview } from '../controllers/reviewController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router({mergeParams: true});

router.route('/').get(getAllReviews).post(protect, createReview);
router.get('/:id', getReview);


export default router;