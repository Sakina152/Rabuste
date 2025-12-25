// routes/authRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateUserRole,
} from '../controllers/authController.js';
import { registerValidation, loginValidation, validate } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);

// Protected routes
router.use(protect);
router.get('/me', getMe);

// Admin routes
router.use(authorize('super_admin'));
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;