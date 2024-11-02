import express from 'express';
import {
  handleLogin,
  handleRegister,
  handleForgetPassword,
  updateProfileController,
  updatePassword,
  emailChange,
  getAllUser,
  updateAddressController,
} from '../controllers/authController.js';

import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';
import upload from '../helpers/multer.js';
const authRouter = express.Router();

// register user

authRouter.post('/register', handleRegister);
authRouter.get('/get-all', getAllUser);
authRouter.post('/login', handleLogin);
authRouter.post('/forget-password', handleForgetPassword);
//protected user route auth
authRouter.get('/user-auth', requiredSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected admin route auth
authRouter.get('/admin-auth', requiredSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
authRouter.put(
  '/profile-update',
  upload.array('image'),
  requiredSignIn,
  updateProfileController
);
authRouter.put('/password-update', requiredSignIn, updatePassword);
authRouter.put('/address-update', requiredSignIn, updateAddressController);

authRouter.put('/email-change', requiredSignIn, emailChange);

export default authRouter;
