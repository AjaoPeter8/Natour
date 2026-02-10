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
