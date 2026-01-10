import express from 'express';
import {
  getSalesOverview,
  getWeeklySalesStats,
  getInquiryStats,
  getDashboardStats
} from '../controllers/artAnalyticsController.js';

const router = express.Router();

// Admin dashboard stats - no auth required yet
// TODO: Add authentication middleware when auth is implemented

router.get('/overview', getSalesOverview);
router.get('/weekly-sales', getWeeklySalesStats);
router.get('/inquiries', getInquiryStats);
router.get('/dashboard', getDashboardStats);

export default router;
