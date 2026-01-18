import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.route('/')
    .get(protect, getNotifications);

router.route('/read-all')
    .put(protect, markAllAsRead);

router.route('/:id/read')
    .put(protect, markAsRead);

export default router;
