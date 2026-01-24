import express from 'express';
import {
  getTour,
  getTourStats,
  deleteTour,
  getAllTours,
  createTour,
  updateTour,
  aliasTopTours,
  getMonthlyPlan
} from '../controllers/tourController.js';

const router = express.Router();
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router.route('/tour-plan/:year').get(getMonthlyPlan)
// router.param('id', checkID);

router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);
router.route('/').get(getAllTours).post(createTour);

export default router;
