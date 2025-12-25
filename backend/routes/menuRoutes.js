// routes/menuRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';  // Fixed import
import {
  getCategories,
  createCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { menuItemValidation, validate } from '../utils/validators.js';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/menu/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Public routes
router.get('/categories', getCategories);
router.get('/items', getMenuItems);

// Protected routes
router.use(protect);

// Menu Admin routes
router.use(authorize('super_admin', 'menu_admin'));

// Category routes
router.post(
  '/categories',
  upload.single('image'),
  createCategory
);
router.delete('/categories/:id', deleteCategory);

// Menu Item routes
router.post(
  '/items',
  upload.single('image'),
  menuItemValidation,
  validate,
  createMenuItem
);
router
  .route('/items/:id')
  .put(upload.single('image'), menuItemValidation, validate, updateMenuItem)
  .delete(deleteMenuItem);

export default router;