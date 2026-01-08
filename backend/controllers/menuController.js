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

const getAdminMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find()
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
    tags,
    isVegetarian,
    isAvailable,
    displayOrder,
  } = req.body;

  const item = await MenuItem.create({
    category,
    name,
    description,
    price: Number(price),
    image: req.file ? req.file.path : null,
    tags: tags
      ? tags.split(',').map(t => t.trim())
      : [],
    isVegetarian: isVegetarian === 'true',
    isAvailable: isAvailable === 'true',
    displayOrder: Number(displayOrder) || 0,
  });

  res.status(201).json(item);
});

// @desc    Update a menu item
// @route   PUT /api/menu/items/:id
// @access  Private/MenuAdmin
const updateMenuItem = asyncHandler(async (req, res) => {
  console.log("🔥 UPDATE MENU ITEM HIT");
console.log("BODY:", req.body);
console.log("FILE:", req.file);

  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  item.name = req.body.name ?? item.name;
  item.description = req.body.description ?? item.description;
  item.price = req.body.price
    ? Number(req.body.price)
    : item.price;

  item.category = req.body.category ?? item.category;

  if (req.body.tags !== undefined) {
    item.tags = req.body.tags
      .split(',')
      .map(t => t.trim());
  }

  if (req.body.isVegetarian !== undefined) {
    item.isVegetarian = req.body.isVegetarian === 'true';
  }

  if (req.body.isAvailable !== undefined) {
    item.isAvailable = req.body.isAvailable === 'true';
  }

  if (req.body.displayOrder !== undefined) {
    item.displayOrder = Number(req.body.displayOrder);
  }

  if (req.file) {
    item.image = req.file.path;
  }

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
  getAdminMenuItems,
};