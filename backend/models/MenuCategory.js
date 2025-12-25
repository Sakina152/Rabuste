// models/MenuCategory.js
import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    icon: {
      type: String,
      default: 'utensils', // Default FontAwesome icon class
    },
    image: {
      type: String,
      default: 'default-category.jpg',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index on displayOrder and isActive for better query performance
menuCategorySchema.index({ displayOrder: 1, isActive: 1 });

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);

export default MenuCategory;