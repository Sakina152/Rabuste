import express from 'express';
import { 
  createOrder, 
  verifyPayment, 
  sendRazorpayConfig 
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', protect, sendRazorpayConfig);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;