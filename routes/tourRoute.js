import express from 'express';
import {
  getTour,
  deleteTour,
  getAllTours,
  createTour,
  updateTour
} from '../controllers/tourController.js';

const router = express.Router();
// router.param('id', checkID);

router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);
router.route('/').get(getAllTours).post(createTour);

export default router;
