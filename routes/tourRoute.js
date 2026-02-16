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
import reviewRouter from '../routes/reviewRoute.js'

const router = express.Router();
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router.route('/tour-plan/:year').get(getMonthlyPlan);
// router.param('id', checkID);
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/:id')
  .get(protect, getTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour)
  .patch(protect, updateTour);
router.route('/').get(protect, getAllTours).post(protect, createTour);

export default router;
