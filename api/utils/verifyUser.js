import jwt from 'jsonwebtoken'; 
import { errorHandler } from './error.js';

// Middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; // Get token from cookies

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden')); 

        req.user = user; // If token is valid, set user in request
        next(); // Call next middleware
    });
};