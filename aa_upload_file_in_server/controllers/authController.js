import User from '../models/userModel.js';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from '../helpers/cloudinary.js';
import fs from 'fs';

export const handleRegister = async (req, res, next) => {
  try {
    const { name, email, phone, answer, password } = req.body;

    // validation
    if (!name || !email || !phone || !answer || !password) {
      return res.send({ message: 'All field are required' });
    }

    const userData = {
      name,
      email,
      phone,
      answer,
      password,
    };
    // user Exist check
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(200).send({
        success: true,
        message: 'User already Exist. please login',
      });
    }

    const user = await User.create(userData);

    res.status(201).send({
      success: true,
      message: 'User Registered successfully',
      user,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: 'User dose not Registered',
    });
    next(error);
    console.error(error);
  }
};

export const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: 'Invalid password or email',
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User Not Exist. Sign up first');
    }
    // password match
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Password not match');
    }
    //Access Token
    const accessToken = Jwt.sign({ user }, process.env.JWT_ACCESS);

    // set cookie
    res.cookie('accessToken', accessToken, {
      // httpOnly: true,
      // secure: true,
      sameSite: 'none',
    });
    //  return user data without password
    const userData = user.toObject();
    delete userData.password;

    res.status(200).send({
      success: true,
      message: 'Login successful',
      userData,
      accessToken,
    });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

// forget password
export const handleForgetPassword = async (req, res, next) => {
  try {
    const { email, answer, new_password } = req.body;

    // validation
    if (!email) {
      return res.send({ message: 'email is required' });
    }
    if (!new_password) {
      return res.send({ message: 'newPassword is required' });
    }
    if (!answer) {
      return res.send({ message: 'Phone is required' });
    }

    // user Exist check
    const user = await User.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Wrong Email Or answer',
      });
    }

    await User.findByIdAndUpdate(user._id, { password: new_password });
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

// User Password update
export const updatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ message: 'User Not Found' });
    }

    // password match
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.send({ message: 'Password not match' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.send({ message: 'Password is not update' });
    }
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully',
    });
  } catch (error) {
    next(error);
  }
};
// User Email Change
export const emailChange = async (req, res, next) => {
  try {
    const { email, newEmail, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ message: 'User Not Found' });
    }

    // password match
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.send({ message: 'Password not match' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { email: newEmail },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.send({ message: 'Email is not update' });
    }
    res.status(200).send({
      success: true,
      message: 'Email Change Successfully',
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAddressController = async (req, res) => {
  try {
    const { userAddress } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        address: userAddress,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Address Updated Successfully',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error While Update address',
      error,
    });
  }
};
//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, answer, gender, phone, date_of_birth } = req.body;

    const user = await User.findById(req.user._id);

    // image handling
    const files = req.files;

    const urls = files.length !== 0 ? [] : user.image;

    if (files.length !== 0) {
      // delete old images
      for (const image of user.image) {
        const { public_id } = image;
        await cloudinary.uploader.destroy(public_id);
      }

      for (const file of files) {
        const { path } = file;
        const result = await cloudinary.uploader.upload(path);
        const data = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        urls.push(data);
        fs.unlinkSync(path);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        answer,
        gender,
        phone,
        date_of_birth,
        image: urls,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Profile Updated Successfully',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error WHile Update profile',
      error,
    });
  }
};
// get all users

export const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find({}, { password: 0 });
    res.status(200).json(allUser);
  } catch (error) {
    console.log(error);
  }
};
