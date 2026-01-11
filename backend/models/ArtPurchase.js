import mongoose from 'mongoose';

const artPurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  art: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Art',
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  deliveryAddress: String,
  purchaseNumber: {
    type: String,
    unique: true
  }
}, { timestamps: true });

artPurchaseSchema.pre('save', async function() {
  if (!this.purchaseNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.purchaseNumber = `ART-${date}-${random}`;
  }
});

artPurchaseSchema.post('save', async function() {
  const Art = mongoose.model('Art');
  await Art.findByIdAndUpdate(this.art, { 
    status: 'Sold',
    soldAt: new Date()
  });
});

const ArtPurchase = mongoose.model('ArtPurchase', artPurchaseSchema);
export default ArtPurchase;