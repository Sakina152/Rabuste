import express from 'express';
import multer from 'multer';
import path from 'path';

// Middleware
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  validate,
  workshopValidation,
  registrationValidation
} from '../utils/validators.js';
import { normalizeWorkshopBody } from '../middleware/normalizeWorkshopBody.js';

// Controllers
import {
  getWorkshops,
  getUpcomingWorkshops,
  getFeaturedWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  cancelWorkshop,
  registerForWorkshop,
  getWorkshopRegistrations,
  getAllRegistrations,
  getRegistrationByNumber,
  updateRegistrationStatus,
  cancelRegistration,
  getWorkshopStats,
  forceDeleteWorkshop
} from '../controllers/workshopController.js';

const router = express.Router();

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/workshops/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'workshop-' +
      uniqueSuffix +
      path.extname(file.originalname).toLowerCase()
    );
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error('Images only!'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

/* ======================================================
   PUBLIC ROUTES (NO AUTH)
====================================================== */

router.get('/', getWorkshops);
router.get('/upcoming', getUpcomingWorkshops);
router.get('/featured', getFeaturedWorkshops);

// registration helpers BEFORE :identifier
router.get('/registrations/:registrationNumber', getRegistrationByNumber);
router.put('/registrations/:registrationNumber/cancel', cancelRegistration);

router.post(
  '/:id/register',
  registrationValidation,
  validate,
  registerForWorkshop
);

// Single workshop (slug or id)
router.get('/:identifier', getWorkshop);

/* ======================================================
   ADMIN ROUTES (AUTH REQUIRED)
====================================================== */

router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Admin stats
router.get('/admin/stats', getWorkshopStats);

// Create workshop
router.post(
  '/',
  upload.single('image'),
  normalizeWorkshopBody,
  workshopValidation,
  validate,
  createWorkshop
);


// Update workshop
router.put(
  '/:id',
  upload.single('image'),
  normalizeWorkshopBody,
  workshopValidation,
  validate,
  updateWorkshop
);

// Cancel workshop (soft)
router.put('/:id/cancel', cancelWorkshop);

// Force delete (hard delete)
router.delete('/:id/force', forceDeleteWorkshop);

// Registrations (admin)
router.get('/admin/registrations', getAllRegistrations);
router.get('/:id/registrations', getWorkshopRegistrations);
router.put('/registrations/:id/status', updateRegistrationStatus);

export default router;