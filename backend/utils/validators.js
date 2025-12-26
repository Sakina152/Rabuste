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