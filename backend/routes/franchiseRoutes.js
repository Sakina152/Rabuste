import express from 'express';
import { submitFranchise, submitContact } from '../controllers/franchiseController.js';

const router = express.Router();

// Route 1: Submit Franchise Application
router.post('/', submitFranchise);

// Route 2: Submit Contact Message
router.post('/contact', submitContact);

export default router;