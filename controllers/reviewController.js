import Review from '../models/reviewModel.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
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

export const updateTourAndId = async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const tour = await Tour.findById(req.body.tour);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  };
  const user = await User.findById(req.body.user);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  next();
};
 

export const getAllReviews = getAll(Review);

export const getReview = getOne(Review);

export const createReview = createOne(Review);

export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
