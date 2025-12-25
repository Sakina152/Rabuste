// models/MenuItem.js
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: [true, 'Please select a category'],
    },
    name: {
      type: String,
      required: [true, 'Please add a menu item name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    image: {
      type: String,
      default: 'default-item.jpg',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isVegetarian: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for better query performance
menuItemSchema.index({ 
  category: 1, 
  isAvailable: 1, 
  displayOrder: 1 
});

// Create text index for search functionality
menuItemSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;