import express from 'express';
import {
  getTour,
  deleteTour,
  getAllTours,
  createTour,
  updateTour,
  aliasTopTours
} from '../controllers/tourController.js';

const router = express.Router();
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
// router.param('id', checkID);

router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);
router.route('/').get(getAllTours).post(createTour);

export default router;
