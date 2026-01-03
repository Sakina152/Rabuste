import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Protect routes - Verifies the JWT Token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      // We rely on the decoded.id matching the token generated in authController
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
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

// ✅ NEW: Flexible Role Checker
// Usage in routes: authorize('super_admin', 'menu_admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Check if user is logged in (req.user exists)
    // 2. Check if their role is in the allowed list
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // 403 means "Forbidden" (Logged in, but no permission)
      throw new Error(`User role '${req.user?.role}' is not authorized to access this route`);
    }
    next();
  };
};

// ✅ NEW: Simple Admin Check (Shortcut)
// Checks if the user is ANYTHING other than a basic 'user'
const admin = (req, res, next) => {
  if (req.user && req.user.role !== 'user') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, authorize, admin };