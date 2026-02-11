import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}


export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        users
    })
})
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        `This route is not for password update. Please use /updateMyPassword`,
        400,
      ),
    );

const filteredObject = filterObj(req.body, 'email', 'name')
  const user = await User.findByIdAndUpdate(req.user.id, filteredObject, {new: true, runValidator: true});
  res.status(200).json({
    status: 'success',
    user
  })
});

export const deleteMe = catchAsync (async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(204).json({
        status: 'success',
        data: null
    })
})
