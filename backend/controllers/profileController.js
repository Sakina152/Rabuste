import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import ArtPurchase from '../models/ArtPurchase.js';
import Booking from '../models/Booking.js';
import Art from '../models/Art.js';
import MenuItem from '../models/MenuItem.js';
import Workshop from '../models/Workshop.js';

export const getUserProfileData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  console.log('Fetching profile data for user:', userId);

  const [orders, artPurchases, workshops] = await Promise.all([
    Order.find({ user: userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 }),

    ArtPurchase.find({ user: userId })
      .populate('art')
      .sort({ createdAt: -1 }),

    Booking.find({ user: userId })
      .populate('workshop')
      .sort({ createdAt: -1 })
  ]);

  console.log('Profile data found:', {
    orders: orders.length,
    artPurchases: artPurchases.length,
    workshops: workshops.length
  });

  res.json({
    orders,
    artPurchases,
    workshops
  });
});
