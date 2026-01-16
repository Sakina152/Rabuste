import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
    getSalesAnalytics,
    getCategoryAnalytics,
    getBestSellers,
    getComprehensiveStats
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes are protected and for admins only
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/sales', getSalesAnalytics);
router.get('/categories', getCategoryAnalytics);
router.get('/bestsellers', getBestSellers);
router.get('/comprehensive', getComprehensiveStats);

export default router;
