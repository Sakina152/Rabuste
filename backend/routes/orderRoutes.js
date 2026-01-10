import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes without authentication (auth not set up yet)
// TODO: Add authentication middleware when auth is implemented

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
