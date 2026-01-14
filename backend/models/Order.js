import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: false
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String,
    required: false
  }
});

const orderSchema = new mongoose.Schema({
  // Link to user (for authenticated orders)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional to support guest orders
  },
  
  // NEW SCHEMA: items array with menuItem references
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  
  // Total amount (using this instead of totalPrice for consistency)
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentId: {
    type: String // Razorpay payment ID
  },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in progress', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // OLD SCHEMA (keep for backward compatibility)
  orderItems: [orderItemSchema],
  
  // Order type: 'MENU' for menu orders, 'ART' for art purchases
  orderType: {
    type: String,
    enum: ['MENU', 'ART'],
    default: 'MENU'
  },
  
  // For art purchases, store the art ID
  artItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Art',
    required: false
  },
  
  totalPrice: {
    type: Number,
    required: false // Made optional since we use totalAmount now
  },
  
  paymentMethod: {
    type: String,
    default: 'Razorpay'
  },
  
  paymentResult: {
    id: String,
    status: String,
    email_address: String,
    razorpay_order_id: String,
    razorpay_payment_id: String
  },
  
  isPaid: {
    type: Boolean,
    default: false
  },
  
  paidAt: {
    type: Date
  },
  
  // Customer information (optional for now, can be linked to User later)
  customerEmail: {
    type: String
  },
  customerName: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isPaid: 1, createdAt: -1 });
orderSchema.index({ orderType: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
