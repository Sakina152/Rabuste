import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js'; 
import Art from '../models/Art.js'; // <--- 1. Import Art Model

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = asyncHandler(async (req, res) => {
  // We now accept 'type' and 'itemId' for Art purchases
  const { cartItems, type, itemId } = req.body; 

  let totalAmount = 0;

  // SCENARIO A: Art Purchase (Single Item)
  if (type === 'ART' && itemId) {
    const artPiece = await Art.findById(itemId);
    
    if (!artPiece) {
      res.status(404);
      throw new Error('Art piece not found');
    }
    if (artPiece.status === 'Sold') {
      res.status(400);
      throw new Error('This artwork is already sold');
    }

    totalAmount = artPiece.price;
  } 
  // SCENARIO B: Menu Purchase (Cart)
  else if (cartItems && cartItems.length > 0) {
    // (Your existing cart logic)
    // For now, assuming price is sent from frontend or calculated simply
    // In production, fetch Product.findById like we planned before
    totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  } else {
    res.status(400);
    throw new Error('Invalid purchase request');
  }

  const options = {
    amount: Math.round(totalAmount * 100), // Paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500);
    throw new Error('Razorpay Error: ' + error.message);
  }
});

// ... keep verifyPayment and sendRazorpayConfig as they are ...
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

export const sendRazorpayConfig = asyncHandler(async (req, res) => {
  res.send({ keyId: process.env.RAZORPAY_KEY_ID });
});