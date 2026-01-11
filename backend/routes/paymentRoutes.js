import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createOrder, 
  verifyPayment, 
  sendRazorpayConfig 
} from '../controllers/paymentController.js';

const router = express.Router();

// Add auth middleware to all routes
router.use(protect);

router.get('/config', sendRazorpayConfig);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;