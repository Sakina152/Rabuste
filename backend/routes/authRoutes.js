import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateUserRole,
  changePassword,
  firebaseAuth,
  updateUserProfile
} from '../controllers/authController.js';
import { protect, authorize, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Firebase authentication route
router.post('/firebase-login', firebaseAuth);

// Keep existing routes for backward compatibility
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

export default router;