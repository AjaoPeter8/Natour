import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';



export const aliasTopTours = (req, res, next) => {
  req.queryParams = {
    ...req.query,
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty'
  };
  console.log('After aliasTopTours:', req.queryParams);
  next();
}

export const getAllTours = async (req, res) => {
  try {
     // Use queryParams if it exists (from aliasTopTours), otherwise use req.query
     const query = req.queryParams || req.query;
     console.log('query:', query);
    const features = new APIFeatures(Tour.find(), query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
     res.status(204).json({
    status: 'success',
    data: null,
  });
  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
 
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
    status: 'success',
    data: {
      tour
    },
  });
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  } 
  
};
