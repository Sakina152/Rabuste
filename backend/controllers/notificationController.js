import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    console.log(`[Notification] Fetching unread for user: ${req.user._id}`);
    const notifications = await Notification.find({
        user: req.user._id,
        isRead: false // Only fetch unread notifications
    })
        .sort({ createdAt: -1 })
        .limit(20);

    console.log(`[Notification] Found ${notifications.length} unread for user: ${req.user._id}`);
    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        if (notification.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
});

export { getNotifications, markAsRead, markAllAsRead };
