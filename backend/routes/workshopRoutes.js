import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
    getWorkshops,
    getUpcomingWorkshops,
    getFeaturedWorkshops,
    getWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    cancelWorkshop,
    getWorkshopStats
} from '../controllers/workshopController.js';
import {
    registerForWorkshop,
    getRegistrationByNumber,
    cancelRegistration,
    getWorkshopRegistrations,
    getAllRegistrations,
    updateRegistrationStatus
} from '../controllers/bookingController.js';

const router = express.Router();

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/workshops/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,    file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
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

// REGISTRATION (Public Access)
router.post('/:id/register', registerForWorkshop);
router.get('/registrations/:registrationNumber', getRegistrationByNumber);
router.put('/registrations/:registrationNumber/cancel', cancelRegistration);

// ==========================================
// ADMIN ROUTES (Protected)
// ==========================================
// Apply protection and role checks to all routes below this line
router.use(protect);
router.use(authorize('WorkshopAdmin', 'SuperAdmin'));

// Workshop Management
router.post('/', upload.single('image'), createWorkshop);
router.put('/:id', upload.single('image'), updateWorkshop);
router.delete('/:id', deleteWorkshop);
router.put('/:id/cancel', cancelWorkshop);
router.get('/stats/summary', getWorkshopStats);

// Registration Management
router.get('/:id/registrations', getWorkshopRegistrations);
router.get('/registrations/all', getAllRegistrations); 
router.put('/registrations/:id/status', updateRegistrationStatus);

export default router;