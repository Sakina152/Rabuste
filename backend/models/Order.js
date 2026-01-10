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
    required: true,
    default: 0
  },
  
  paymentMethod: {
    type: String,
    required: true,
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
    required: true,
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
  },
  
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
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
