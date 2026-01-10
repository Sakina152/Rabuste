import express from 'express';
import { 
  createOrder, 
  verifyPayment, 
  sendRazorpayConfig 
} from '../controllers/paymentController.js';

const router = express.Router();

// Payment routes without authentication (auth not set up yet)
// TODO: Add authentication middleware when auth is implemented
router.get('/config', sendRazorpayConfig);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;