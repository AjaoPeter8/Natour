import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}


export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

export const getAllUsers = getAll(User);

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

export const getUser = getOne(User);
export const deleteUser = deleteOne(User);
//DO NO UPDATE PASSWORD HERE
export const updateUser = updateOne(User);