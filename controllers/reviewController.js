import Review from '../models/reviewModel.js';
// import catchAsync from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getOne,
  updateOne,
  getAll,
} from './handlerFactory.js';

const response = (statusCode, data, res) => {
  res.status(statusCode).json({
    status: 'success',
    length: data.length,
    data,
  });
};

export const updateTourAndId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const getAllReviews = getAll(Review);

export const getReview = getOne(Review);

export const createReview = createOne(Review);

export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
