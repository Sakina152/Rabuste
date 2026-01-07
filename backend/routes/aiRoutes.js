import express from 'express';
import { getMoodRecommendation } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', getMoodRecommendation);

export default router;