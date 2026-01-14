import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import MenuItem from '../models/MenuItem.js';
import Art from '../models/Art.js';
import Order from '../models/Order.js'; 
import ArtPurchase from '../models/ArtPurchase.js';

// Validate Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('⚠️  WARNING: Razorpay credentials are missing from environment variables!');
  console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createOrder = asyncHandler(async (req, res) => {
  // Validate Razorpay credentials
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    res.status(500);
    throw new Error('Payment service is not configured. Please contact administrator.');
  }

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
  else if (type === 'MENU' && cartItems && cartItems.length > 0) {
    // Fetch menu items from database to validate prices
    const menuItemIds = cartItems.map(item => item.id || item.product || item._id).filter(Boolean);
    
    if (menuItemIds.length === 0) {
      res.status(400);
      throw new Error('Invalid cart items: no valid item IDs found');
    }

    try {
      const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true });
      
      // Calculate total from database prices (validate against actual prices)
      totalAmount = cartItems.reduce((acc, cartItem) => {
        const itemId = cartItem.id || cartItem.product || cartItem._id;
        const menuItem = menuItems.find(m => m._id.toString() === itemId);
        
        if (!menuItem) {
          throw new Error(`Menu item ${itemId} not found or not available`);
        }
        
        const quantity = cartItem.quantity || 1;
        return acc + (menuItem.price * quantity);
      }, 0);
    } catch (error) {
      // If database lookup fails, use frontend prices as fallback (with warning logged)
      console.warn('Warning: Could not validate prices from database, using frontend prices:', error.message);
      totalAmount = cartItems.reduce((acc, item) => {
        if (!item.price || item.price <= 0) {
          throw new Error(`Invalid price for item ${item.id || item.name}`);
        }
        return acc + (item.price * (item.quantity || 1));
      }, 0);
    }
  } else {
    res.status(400);
    throw new Error('Invalid purchase request. Please provide either cartItems for menu order or itemId for art purchase.');
  }

  // Validate amount
  if (!totalAmount || totalAmount <= 0) {
    res.status(400);
    throw new Error('Invalid amount. Total amount must be greater than zero.');
  }

  const options = {
    amount: Math.round(totalAmount * 100), // Convert to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error(`Payment gateway error: ${error.message || 'Failed to create order'}`);
  }
});

// ... keep verifyPayment and sendRazorpayConfig as they are ...
export const verifyPayment = asyncHandler(async (req, res) => {
  // Try multiple field name variations (Razorpay sometimes returns different formats)
  const razorpay_order_id = req.body.razorpay_order_id || req.body.order_id || req.body.razorpayOrderId;
  const razorpay_payment_id = req.body.razorpay_payment_id || req.body.payment_id || req.body.razorpayPaymentId;
  const razorpay_signature = req.body.razorpay_signature || req.body.signature || req.body.razorpaySignature;

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.error('Missing payment verification data:', {
      has_order_id: !!razorpay_order_id,
      has_payment_id: !!razorpay_payment_id,
      has_signature: !!razorpay_signature,
      received_keys: Object.keys(req.body),
      body_sample: JSON.stringify(req.body).substring(0, 200)
    });
    res.status(400);
    throw new Error('Missing payment verification data. Required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature');
  }

  // Trim any whitespace from values
  const orderId = String(razorpay_order_id).trim();
  const paymentId = String(razorpay_payment_id).trim();
  const receivedSignature = String(razorpay_signature).trim();

  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.error('RAZORPAY_KEY_SECRET is not configured');
    res.status(500);
    throw new Error('Payment service configuration error: Missing secret key');
  }

  // Trim the secret key to avoid issues with extra whitespace
  const secretKey = String(process.env.RAZORPAY_KEY_SECRET).trim();

  // Razorpay signature verification format: order_id|payment_id (exact format)
  const signatureBody = `${orderId}|${paymentId}`;
  
  // Generate expected signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureBody, 'utf8')
    .digest("hex");

  // Razorpay signatures should match exactly (case-sensitive)
  // But we'll try both exact and case-insensitive comparison
  const signatureMatch = 
    receivedSignature === expectedSignature || 
    receivedSignature.toLowerCase() === expectedSignature.toLowerCase();

  // Debug logging (remove sensitive data in production)
  console.log('Payment Verification Details:', {
    order_id: orderId,
    payment_id: paymentId,
    body_string: signatureBody,
    received_sig_length: receivedSignature.length,
    expected_sig_length: expectedSignature.length,
    received_sig_prefix: receivedSignature.substring(0, 20),
    expected_sig_prefix: expectedSignature.substring(0, 20),
    exact_match: receivedSignature === expectedSignature,
    case_insensitive_match: receivedSignature.toLowerCase() === expectedSignature.toLowerCase(),
    final_match: signatureMatch
  });

  if (signatureMatch) {
    try {
      // Get order data from request body
      const { orderData } = req.body;
      
      console.log('Order data received:', orderData); // Add debug log
      
      if (orderData) {
        // Get user ID if authenticated, otherwise use null/guest
        const userId = req.user ? req.user._id : null;
        
        // Create order records based on type
        if (orderData.type === 'ART' && orderData.itemId) {
          const artPurchaseData = {
            art: orderData.itemId,
            purchasePrice: orderData.amount / 100, // Convert from paise to rupees
            paymentStatus: 'completed',
            paymentId: paymentId,
            status: 'confirmed'
          };
          
          // Only add user if authenticated
          if (userId) {
            artPurchaseData.user = userId;
          }
          
          const artPurchase = new ArtPurchase(artPurchaseData);
          await artPurchase.save();
          console.log('Art purchase saved:', artPurchase._id);
          
          // Mark art as sold
          await Art.findByIdAndUpdate(orderData.itemId, { status: 'Sold' });
          
        } else if (orderData.type === 'MENU' && orderData.cartItems) {
          const orderDocument = {
            items: orderData.cartItems.map(item => ({
              menuItem: item.id || item._id,
              quantity: item.quantity || 1,
              price: item.price
            })),
            totalAmount: orderData.amount / 100, // Convert from paise to rupees
            paymentStatus: 'completed',
            paymentId: paymentId,
            status: 'confirmed'
          };
          
          // Only add user if authenticated
          if (userId) {
            orderDocument.user = userId;
          }
          
          const order = new Order(orderDocument);
          await order.save();
          console.log('Order saved:', order._id);
        }
      } else {
        console.log('No orderData received in payment verification');
      }

      res.json({ 
        status: "success", 
        message: "Payment verified successfully",
        order_id: orderId,
        payment_id: paymentId
      });
    } catch (error) {
      console.error('Error creating order after payment:', error);
      // Still return success for payment verification, but log the error
      res.json({ 
        status: "success", 
        message: "Payment verified successfully (order creation pending)",
        order_id: orderId,
        payment_id: paymentId,
        warning: "Order record creation failed"
      });
    }
  } else {
    // Don't log full signatures in error (security)
    console.error('Payment verification failed - Signature mismatch:', {
      order_id: orderId,
      payment_id: paymentId,
      received_sig_length: receivedSignature.length,
      expected_sig_length: expectedSignature.length,
      secret_key_length: secretKey.length,
      secret_key_preview: secretKey.substring(0, 10) + '...' // For debugging config issues
    });
    
    res.status(400);
    throw new Error(`Payment verification failed: Invalid signature. Please ensure:
      1. RAZORPAY_KEY_SECRET matches your Razorpay dashboard
      2. You're using the correct key (test vs live mode)
      3. The payment was made with the same account credentials`);
  }
});

export const sendRazorpayConfig = asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    res.status(500);
    throw new Error('Payment service is not configured');
  }
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});