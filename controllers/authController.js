import { promisify } from 'util';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Kindly input email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    await bcrypt.compare(
      'oooooo',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2NkODE5M2NmZjc4YmU5N2NmZmI5OSIsImlhdCI6MTc2OTc4OTQ2NiwiZXhwIjoxNzc3NTY1NDY2fQ.NVNQtkKW6YpbZAVpE1dhonBGZEw2Lc-dpq3X9oQ5KMo',
    );
    return next(new AppError('Wrong email or password', 401));
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) return next(new AppError('Wrong email or password', 401));
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Plesae  login to have access.', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user associated with this token has been deleted', 401),
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('The password was changed. Please login again'),
      401,
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Running:', req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this request',
          403,
        ),
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('Please input an email', 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Click on the link below to reset your password \n ${resetURL}. If you didn't forget your password, please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later',
        500,
      ),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError('Please provide a passowrd', 400));
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //updated changedPassword at the userModel
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
    if (!req.body) return next(new AppError('Please provide a passowrd', 400));
  const user = await User.findById(req.user.id).select('+password');
  const correct = await user.correctPassword(req.body.passwordCurrent, user.password);
  if (!correct) return next(new AppError('Wrong password', 401));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  })
});
