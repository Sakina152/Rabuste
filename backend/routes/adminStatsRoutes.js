import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getSalesOverview,
  getWeeklySalesStats,
  getInquiryStats
} from '../controllers/artAnalyticsController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Admin dashboard stats
router.get('/overview', getSalesOverview);
router.get('/weekly-sales', getWeeklySalesStats);
router.get('/inquiries', getInquiryStats);

export default router;
