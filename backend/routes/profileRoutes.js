import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfileData } from '../controllers/profileController.js';

const router = express.Router();

router.use(protect);
router.get('/data', getUserProfileData);

export default router;