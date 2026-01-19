import express from 'express';
import {
  getTour,
  deleteTour,
  getAllTours,
  createTour,
  updateTour,
  checkID,
  checkBody
} from '../controllers/tourController.js';

const router = express.Router();
router.param('id', checkID);

router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);
router.route('/').get(getAllTours).post(checkBody,createTour);

export default router;
