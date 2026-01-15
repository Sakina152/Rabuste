import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Art from '../models/Art.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (no auth required yet)
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    orderType = 'MENU',
    artItem,
    totalPrice,
    paymentMethod = 'Razorpay',
    paymentResult,
    isPaid = false,
    paidAt,
    customerEmail,
    customerName,
    user // Add user to destructuring
  } = req.body;

  // Validate required fields
  if (orderType === 'MENU' && (!orderItems || orderItems.length === 0)) {
    res.status(400);
    throw new Error('Order items are required for menu orders');
  }

  if (orderType === 'ART' && !artItem) {
    res.status(400);
    throw new Error('Art item is required for art orders');
  }

  if (!totalPrice || totalPrice <= 0) {
    res.status(400);
    throw new Error('Invalid total price');
  }

  // Create order
  const order = await Order.create({
    user, // Save user ID
    orderItems: orderItems || [],
    orderType,
    artItem: orderType === 'ART' ? artItem : undefined,
    totalPrice,
    paymentMethod,
    paymentResult: paymentResult || {},
    isPaid,
    paidAt: paidAt ? new Date(paidAt) : (isPaid ? new Date() : undefined),
    customerEmail,
    customerName,
    status: isPaid ? 'in progress' : 'pending'
  });

  // If it's an art order and payment is successful, mark art as sold
  if (orderType === 'ART' && artItem && isPaid) {
    try {
      const artPiece = await Art.findById(artItem);
      if (artPiece && artPiece.status !== 'Sold') {
        artPiece.status = 'Sold';
        artPiece.soldAt = new Date();
        await artPiece.save();
      }
    } catch (error) {
      console.error('Error updating art status:', error);
      // Don't fail the order creation if art update fails
    }
  }

  res.status(201).json(order);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (no auth required yet, add later)
export const getOrders = asyncHandler(async (req, res) => {
  const { orderType, status, startDate, endDate } = req.query;

  const query = {};

  if (orderType) {
    query.orderType = orderType;
  }

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const orders = await Order.find(query)
    .populate('artItem', 'title artist price imageUrl')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(orders);
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public (no auth required yet)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('artItem', 'title artist price imageUrl');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(order);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (add auth later)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['pending', 'in progress', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.json(order);
});

// @desc    Get orders by user email
// @route   GET /api/orders/user/:email
// @access  Public (add auth later)
export const getOrdersByUser = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const orders = await Order.find({ customerEmail: email })
    .populate('artItem', 'title artist price imageUrl')
    .populate('orderItems.product', 'name price image')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(orders);
});
