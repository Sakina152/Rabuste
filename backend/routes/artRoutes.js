import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import multer from 'multer';
import path from 'path';
import {
    getAllArt,
    addArt,
    updateArtStatus,
    submitInquiry,
    updateArt,
    deleteArt,
    purchaseArt
} from '../controllers/artController.js';

const router = express.Router();

// --- Public Routes ---
// Anyone can view the gallery and send an inquiry
router.get('/', getAllArt);
router.post('/inquiry', submitInquiry);

// --- Protected Routes (Any Logged-in User) ---
// Buying art requires login, but you don't need to be an admin
router.post('/purchase/:id', protect, purchaseArt);

// --- Admin Only Routes ---
// Everything below this line requires Admin privileges
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.post('/', addArt);
router.put('/:id', updateArt);
router.patch('/:id/status', updateArtStatus);
router.delete('/:id', deleteArt);

export default router;