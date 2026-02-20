import express from 'express';
import {
  getTour,
  getTourStats,
  deleteTour,
  getAllTours,
  createTour,
  updateTour,
  aliasTopTours,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import reviewRouter from '../routes/reviewRoute.js';

const router = express.Router();
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router
  .route('/tour-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
// router.param('id', checkID);
router.use('/:tourId/reviews', reviewRouter);

router.route('/').get(getAllTours).post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour);

export default router;
