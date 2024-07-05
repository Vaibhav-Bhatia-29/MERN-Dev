import User from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs'; // For password hashing
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'; 


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // Get username, email, and password from request body
  const hashedPassword = bcryptjs.hashSync(password, 10); // Hash the password
  const newUser = new User({ username, email, password: hashedPassword }); // Create a new User instance
  try {
    await newUser.save(); // Save the new user to the database
    res.status(201).json('User created successfully!'); 
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body; // Get email and password from request body
  try {
    const validUser = await User.findOne({ email }); // Find user by email
    if (!validUser) return next(errorHandler(404, 'User not found!')); 
    const validPassword = bcryptjs.compareSync(password, validUser.password); // Check if password is correct
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!')); 
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // Generate a JWT token
    const { password: pass, ...rest } = validUser._doc; // Exclude password from the response
    res
      .cookie('access_token', token, { httpOnly: true }) // Set the token as a cookie
      .status(200)
      .json(rest); 
  } catch (error) {
    next(error);
  }
};


export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token'); // Clear the authentication cookie
    res.status(200).json('User has been logged out!'); 
  } catch (error) {
    next(error); 
  }
};
