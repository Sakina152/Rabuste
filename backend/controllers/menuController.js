// controllers/menuController.js
import asyncHandler from 'express-async-handler';
import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get all active categories
// @route   GET /api/menu/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await MenuCategory.find({ isActive: true })
    .sort('displayOrder')
    .select('-__v');
  res.json(categories);
});

// @desc    Create a new category
// @route   POST /api/menu/categories
// @access  Private/MenuAdmin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, image, displayOrder } = req.body;

  const category = await MenuCategory.create({
    name,
    description,
    icon,
    image,
    displayOrder,
  });

  res.status(201).json(category);
});

// @desc    Delete a category (soft delete)
// @route   DELETE /api/menu/categories/:id
// @access  Private/MenuAdmin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await MenuCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.isActive = false;
  await category.save();

  res.json({ message: 'Category deactivated' });
});

// @desc    Get all menu items
// @route   GET /api/menu/items
// @access  Public
const getMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ isAvailable: true })
    .populate('category', 'name')
    .sort('displayOrder');
  res.json(items);
});

// @desc    Create a new menu item
// @route   POST /api/menu/items
// @access  Private/MenuAdmin
const createMenuItem = asyncHandler(async (req, res) => {
  const {
    category,
    name,
    description,
    price,
    image,
    tags,
    isVegetarian,
    displayOrder,
  } = req.body;

  const item = await MenuItem.create({
    category,
    name,
    description,
    price,
    image,
    tags,
    isVegetarian,
    displayOrder,
  });

  res.status(201).json(item);
});

// @desc    Update a menu item
// @route   PUT /api/menu/items/:id
// @access  Private/MenuAdmin
const updateMenuItem = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    image,
    tags,
    isVegetarian,
    isAvailable,
    displayOrder,
  } = req.body;

  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  item.name = name || item.name;
  item.description = description !== undefined ? description : item.description;
  item.price = price || item.price;
  item.image = image || item.image;
  item.tags = tags || item.tags;
  if (isVegetarian !== undefined) item.isVegetarian = isVegetarian;
  if (isAvailable !== undefined) item.isAvailable = isAvailable;
  if (displayOrder !== undefined) item.displayOrder = displayOrder;

  const updatedItem = await item.save();
  res.json(updatedItem);
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/items/:id
// @access  Private/MenuAdmin
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  res.json({ message: 'Menu item removed' });
});

export {
  getCategories,
  createCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};