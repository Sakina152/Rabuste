import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
    getAllArt,
    addArt,
    updateArtStatus,
    submitInquiry,
    updateArt,
    deleteArt
} from '../controllers/artController.js';
import {
    getSalesOverview,
    getWeeklySalesStats,
    getInquiryStats
} from '../controllers/artAnalyticsController.js';

const router = express.Router();

// --- Public routes ---
// Anyone can view the gallery and send an inquiry
router.get('/', getAllArt);
router.post('/inquiry', submitInquiry);

// --- Protected routes ---
// Only logged-in Admins can add or change the status of art
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.post('/', addArt);
router.put('/:id', updateArt);
router.patch('/:id/status', updateArtStatus);
router.delete('/:id', deleteArt);

export default router;