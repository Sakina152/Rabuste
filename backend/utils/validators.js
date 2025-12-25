// utils/validators.js
import { body, validationResult } from 'express-validator';

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

// Validation chains
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password').exists().withMessage('Password is required'),
];

const menuItemValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category').isMongoId().withMessage('Invalid category ID'),
];

export {
  validate,
  registerValidation,
  loginValidation,
  menuItemValidation,
};