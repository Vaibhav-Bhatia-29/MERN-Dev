import bcryptjs from 'bcryptjs'; // Importing bcryptjs for password hashing
import User from '../models/user.model.js'; 
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';


export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!')); 
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10); 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc; // Exclude password from the response

    res.status(200).json(rest); // Send the updated user info as response
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id); // Delete the user
    res.clearCookie('access_token'); // Clear the authentication cookie
    res.status(200).json('User has been deleted!'); 
  } catch (error) {
    next(error);
  }
};


export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id }); // Find listings of the user
      res.status(200).json(listings); // Send listings as response
    } catch (error) {
      next(error); 
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!')); 
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id); // Find the user by ID

    if (!user) return next(errorHandler(404, 'User not found!')); 

    const { password: pass, ...rest } = user._doc; // Exclude password from the response

    res.status(200).json(rest); // Send the user info as response
  } catch (error) {
    next(error); 
  }
};
