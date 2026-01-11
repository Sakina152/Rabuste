import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import firebaseAdmin from '../firebase.js'; 
import User from '../models/User.js';

// Protect routes - Verifies both JWT and Firebase tokens
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Try Firebase token first
      try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token); // Use firebaseAdmin instead of admin
        
        // Get user from Firebase UID
        req.user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found in database');
        }

        if (!req.user.isActive) {
          res.status(401);
          throw new Error('Account is deactivated');
        }

        // Add Firebase user info to request for potential use
        req.firebaseUser = decodedToken;
        
        next();
        return;
      } catch (firebaseError) {
        // If Firebase token fails, try JWT (backward compatibility)
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');

          if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
          }

          next();
          return;
        } catch (jwtError) {
          // Both Firebase and JWT failed
          throw new Error('Not authorized, invalid token');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user?.role}' is not authorized to access this route`);
    }
    next();
  };
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role !== 'user') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, authorize, adminOnly };