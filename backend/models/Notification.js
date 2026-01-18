import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['ORDER_UPDATE', 'SYSTEM', 'PROMOTION'],
            default: 'ORDER_UPDATE',
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
