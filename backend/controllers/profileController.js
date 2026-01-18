import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import ArtPurchase from '../models/ArtPurchase.js';
import Booking from '../models/Booking.js';
import Art from '../models/Art.js';
import User from '../models/User.js';

export const getUserProfileData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  console.log('Fetching profile data for user:', userId);

  const [orders, artPurchases, workshops, user] = await Promise.all([
    Order.find({ user: userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 }),

    ArtPurchase.find({ user: userId })
      .populate('art')
      .sort({ createdAt: -1 }),

    Booking.find({
      $or: [
        { user: userId },
        { 'participantDetails.email': req.user.email }
      ]
    })
      .populate('workshop')
      .sort({ createdAt: -1 }),

    User.findById(userId).populate('savedArtworks')
  ]);

  res.json({
    orders,
    artPurchases,
    workshops,
    savedArtworks: user.savedArtworks || []
  });
});

export const toggleSavedArt = asyncHandler(async (req, res) => {
  const { artId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isAlreadySaved = user.savedArtworks.includes(artId);

  if (isAlreadySaved) {
    user.savedArtworks = user.savedArtworks.filter(id => id.toString() !== artId);
  } else {
    user.savedArtworks.push(artId);
  }

  await user.save();
  res.json({ message: isAlreadySaved ? 'Removed from favorites' : 'Added to favorites', savedArtworks: user.savedArtworks });
});
