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

// Controller Functions
import {
    getWorkshops,
    getUpcomingWorkshops,
    getFeaturedWorkshops,
    getWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    cancelWorkshop,
    registerForWorkshop,
    getWorkshopRegistrations,
    getAllRegistrations,
    getRegistrationByNumber,
    updateRegistrationStatus,
    cancelRegistration,
    getWorkshopStats
} from '../controllers/workshopController.js';

const router = express.Router();

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/workshops/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.get('/', getWorkshops);
router.get('/upcoming', getUpcomingWorkshops);
router.get('/featured', getFeaturedWorkshops);

// Handle registration number/cancel before the general :identifier to avoid route conflicts
router.get('/registrations/:registrationNumber', getRegistrationByNumber);
router.put('/registrations/:registrationNumber/cancel', cancelRegistration);

// Single workshop by ID or Slug
router.get('/:identifier', getWorkshop);

// Registration (Public)
router.post(
    '/:id/register', 
    registrationValidation, 
    validate, 
    registerForWorkshop
);

// ==========================================
// ADMIN ROUTES (Protected)
// ==========================================

// Apply protection to all routes below
router.use(protect);
router.use(authorize('WorkshopAdmin', 'SuperAdmin'));

// Workshop Management
router.get('/admin/stats', getWorkshopStats); // Specific path for stats
router.post(
    '/', 
    upload.single('image'), 
    workshopValidation, 
    validate, 
    createWorkshop
);

router.put(
    '/:id', 
    upload.single('image'), 
    workshopValidation, 
    validate, 
    updateWorkshop
);

router.delete('/:id', deleteWorkshop);
router.put('/:id/cancel', cancelWorkshop);

// Registration Management
router.get('/:id/registrations', getWorkshopRegistrations);
router.get('/admin/registrations', getAllRegistrations); 
router.put('/registrations/:id/status', updateRegistrationStatus);

export default router;