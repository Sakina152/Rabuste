import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/workshopInquiryController.js';

const router = express.Router();

// Public route - submit inquiry
router.post('/', submitInquiry);

// Admin routes - require authentication and admin role
router.get('/', protect, authorize('admin'), getAllInquiries);
router.put('/:id/status', protect, authorize('admin'), updateInquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);

export default router;
