import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';

const response = (statusCode, data, res) => {
  res.status(statusCode).json({
    status: 'success',
    length: data.length,
    data,
  });
};

export const getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId}
  const reviews = await Review.find(filter);
  response(200, reviews, res);
});

export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  response(200, review, res);
});

export const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const { review, rating, tour, user } = req.body;
  const newReview = await Review.create({
    review,
    rating,
    tour,
    user,
  });
  response(201, newReview, res);
});
