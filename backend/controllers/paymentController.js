import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
// Note: If you have a Product model, import it. If not, remove the import and the price calculation logic for now.
// import Product from '../models/Product.js'; 

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  // Simple Total Calculation (Ideally, fetch prices from DB here for security)
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const options = {
    amount: Math.round(totalAmount * 100), // Amount in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500);
    throw new Error('Something went wrong with Razorpay Order');
  }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ status: "success", message: "Payment verified" });
  } else {
    res.status(400);
    throw new Error("Invalid signature");
  }
});

// @desc    Send Razorpay Key ID
// @route   GET /api/payment/config
// @access  Private
export const sendRazorpayConfig = asyncHandler(async (req, res) => {
  res.send({
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});