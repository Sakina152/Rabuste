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
        cb(null, 'workshop-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

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
router.get('/:identifier', getWorkshop);

// Handle registration number/cancel before the general :identifier to avoid route conflicts
router.get('/registrations/:registrationNumber', getRegistrationByNumber);
router.put('/registrations/:registrationNumber/cancel', cancelRegistration);

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
router.get('/admin/stats', getWorkshopStats);

// Create new workshop
router.post(
    '/', 
    upload.single('image'), 
    workshopValidation, 
    validate, 
    createWorkshop
);

// Update workshop
router.put(
    '/:id', 
    upload.single('image'), 
    workshopValidation, 
    validate, 
    updateWorkshop
);

// Delete workshop
router.delete('/:id', deleteWorkshop);

// Cancel workshop
router.put('/:id/cancel', cancelWorkshop);

// Get registrations for a specific workshop
router.get('/:id/registrations', getWorkshopRegistrations);

// Get all registrations (admin)
router.get('/admin/registrations', getAllRegistrations);

// Update registration status
router.put('/registrations/:id/status', updateRegistrationStatus);

export default router;