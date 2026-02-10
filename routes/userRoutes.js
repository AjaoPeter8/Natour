import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} from '../controllers/authController.js';
import { updateMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);

export default router;
