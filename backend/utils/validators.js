// utils/validators.js
import { body, validationResult } from 'express-validator';

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
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
  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description too long'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .custom((value) => {
      if (isNaN(value)) {
        throw new Error('Price must be a number');
      }
      if (Number(value) < 0) {
        throw new Error('Price must be positive');
      }
      return true;
    }),

  body('tags')
    .optional()
    .custom((value) => {
      // Accept empty string, string, or array
      if (value === '') return true;
      if (typeof value === 'string') return true;
      if (Array.isArray(value)) return true;
      throw new Error('Invalid tags format');
    }),

  body('isVegetarian')
    .optional()
    .custom((value) => {
      if (value === 'true' || value === 'false') return true;
      throw new Error('Invalid vegetarian value');
    }),

  body('isAvailable')
    .optional()
    .custom((value) => {
      if (value === 'true' || value === 'false') return true;
      throw new Error('Invalid availability value');
    }),

  body('displayOrder')
    .optional()
    .custom((value) => {
      if (value === undefined || value === '') return true;
      if (isNaN(value)) {
        throw new Error('Display order must be a number');
      }
      return true;
    }),
];


const workshopValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters long'),
  body('type')
    .isIn(['coffee', 'art', 'community', 'special'])
    .withMessage('Invalid workshop type'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Workshop date must be in the future');
      }
      return true;
    }),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('maxParticipants')
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
];

const registrationValidation = [
  body('participantDetails.name')
    .trim()
    .notEmpty()
    .withMessage('Participant name is required'),
  body('participantDetails.email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('participantDetails.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('numberOfSeats')
    .isInt({ min: 1, max: 5 })
    .withMessage('You can book between 1 and 5 seats'),
];

export {
  validate,
  registerValidation,
  loginValidation,
  menuItemValidation,
  workshopValidation,
  registrationValidation
};