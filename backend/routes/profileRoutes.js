import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfileData, toggleSavedArt } from '../controllers/profileController.js';

const router = express.Router();

router.use(protect);
router.get('/data', getUserProfileData);
router.post('/toggle-favourite-art', toggleSavedArt);

export default router;