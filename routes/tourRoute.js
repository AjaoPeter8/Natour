import express from 'express';
import {getTour, deleteTour, getAllTours, createTour} from '../controllers/tourController.js';

const router = express.Router();

router.get('/:id', getTour, deleteTour);
router.route('/').get(getAllTours).post(createTour);

export default router;