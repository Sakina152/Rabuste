import mongoose from 'mongoose';

const artSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A painting must have a title'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  dimensions: {
    type: String,
    required: false
  },
  soldAt: {
    type: Date,
    default: null
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image']
  },
  category: {
    type: String,
    enum: ['Abstract', 'Acrylic', 'Oil', 'Watercolour', 'Charcoal', 'Mixed Media', 'Digital', 'Other'],
    default: 'Abstract'
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Reserved', 'Sold'],
    default: 'Available'
  }
}, { timestamps: true });

const Art = mongoose.model("Art", artSchema);

export default Art;