import express from 'express';
import upload from '../config/multer.js';
import { submitPortfolio } from '../controllers/artistSubmissionController.js';

const router = express.Router();

router.post('/', upload.array('portfolio', 5), submitPortfolio); // Allow up to 5 files

export default router;
