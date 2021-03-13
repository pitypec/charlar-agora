import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Profile from '../models/profileModel.js';
import { sendEmail } from '../utils/mailer.js';
import {
  signActivationToken,
  signRefreshToken,
  signAccessToken
} from '../utils/token.js';
import { htmlMail } from '../utils/mailer.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-local.password');
    if (!users) return res.status(400).json({ msg: 'no user found' });
    if (users) {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.value.body;
    const user = await User.findOne({ 'local.email': email });
    if (user) return res.status(400).json({ msg: 'email already in use' });

    const newUser = {
      email,
      password
    };
    const activateToken = signActivationToken(newUser);
    const CLIENT_URL = process.env.CLIENT_URL;
    const url = `${CLIENT_URL}/user/activate/${activateToken}`;
    const htmlConstruct = htmlMail(url, 'activate email address');
    const Mailer = process.env.EMAIL_SENDER;
    sendEmail(Mailer, email, 'Email Activation', htmlConstruct);
    return res.status(200).json({ msg: 'Registeration complete' });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const activateEmail = async (req, res, next) => {
  const { token } = req.body;
  try {
    const { email, password } = jwt.verify(
      token,
      process.env.ACTIVATION_JWT_SECRET
    );
    const newUser = new User({
      method: 'local',
      local: { email, password }
    });
    await newUser.save();
    return res.status(200).json({ msg: 'Email activated successfully' });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const loginUser = (req, res, next) => {
  const refreshToken = signRefreshToken({ id: req.user._id });
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    path: '/users/refresh_token',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return res.status(200).json({ msg: 'login successful' });
};
export const getAccessToken = async (req, res, next) => {
  const token = req.cookies.refreshtoken;
  if (!token) {
    return res.status(401).json({ msg: 'unauthorized' });
  }
  jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json('invalid/expired token');
    if (user) {
      const accesstoken = signAccessToken({ id: user.id });
      return res.status(200).json({ accesstoken });
    }
  });
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.value.body;
    const user = await User.findOne({ 'local.email': email });
    if (!user)
      return res.status(400).json({ msg: 'please provide a valid email' });
    const accesstoken = signAccessToken({ id: user._id });
    const CLIENT_URL = process.env.CLIENT_URL;
    const url = `${CLIENT_URL}/user/reset/${accesstoken}`;
    const htmlConstruct = htmlMail(url, 'reset your password');
    const Mailer = process.env.EMAIL_SENDER;
    sendEmail(Mailer, email, 'Reset Password', htmlConstruct);
    return res
      .status(200)
      .json({ msg: 'Check your email for link to reset password' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.value.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate({
      id: req.user._id,
      'local.password': hashedPassword
    });
    return res.status(200).json({ msg: 'password changed successfully' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshtoken', { path: '/users/refresh_token' });
    return res.status(200).json({ msg: 'logout successful' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-local.password');
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('profile');
    // const profile = user.profile;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const createUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  const { firstName, middleName, lastName, location } = req.body;
  try {
    const newProfile = new Profile({
      firstName,
      middleName,
      lastName,
      location
    });
    // console.log(newProfile);
    const user = await User.findById(userId);
    console.log(user);
    newProfile.owner = user;
    await newProfile.save();
    console.log(user);
    user.profile = newProfile;
    console.log(user);
    await user.save();
    return res.status(200).json({ msg: 'profile saved successfully' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
