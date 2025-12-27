import Workshop from '../models/Workshop.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// ==================== WORKSHOP CRUD ====================

/**
 * @desc    Get all workshops (with filters)
 * @route   GET /api/workshops
 * @access  Public
 */
export const getWorkshops = async (req, res) => {
    try {
        const { type, status, featured, upcoming, page = 1, limit = 10 } = req.query;
        let query = {};

        // Filter: only published for public, all for admin
        const isAdmin = req.user && ['WorkshopAdmin', 'SuperAdmin'].includes(req.user.role);
        if (!isAdmin) {
            query.status = 'published';
        } else if (status) {
            query.status = status;
        }

        if (type) query.type = type;
        if (featured) query.isFeatured = featured === 'true';
        if (upcoming === 'true') query.date = { $gte: new Date() };

        const skip = (page - 1) * limit;

        const workshops = await Workshop.find(query)
            .sort({ date: 1 }) // Sort by date ascending for upcoming
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Workshop.countDocuments(query);

        res.status(200).json({
            success: true,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
            data: workshops // Virtuals (availableSeats) included via Model config
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get single workshop by ID or slug
 * @route   GET /api/workshops/:identifier
 * @access  Public
 */
export const getWorkshop = async (req, res) => {
    try {
        const { identifier } = req.params;
        const query = mongoose.Types.ObjectId.isValid(identifier) 
            ? { _id: identifier } 
            : { slug: identifier };

        const workshop = await Workshop.findOne(query).populate('createdBy', 'name');

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'Workshop not found' });
        }

        res.status(200).json({ success: true, data: workshop });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get upcoming workshops
 * @route   GET /api/workshops/upcoming
 * @access  Public
 */
export const getUpcomingWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({
            date: { $gte: new Date() },
            status: 'published'
        })
        .sort({ date: 1 })
        .limit(6);

        res.status(200).json({ success: true, data: workshops });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get featured workshops
 * @route   GET /api/workshops/featured
 * @access  Public
 */
export const getFeaturedWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({
            isFeatured: true,
            status: 'published',
            date: { $gte: new Date() }
        }).sort({ date: 1 });

        res.status(200).json({ success: true, data: workshops });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Create workshop
 * @route   POST /api/workshops
 * @access  Private/WorkshopAdmin
 */
export const createWorkshop = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        if (req.file) req.body.image = req.file.path;

        const workshop = await Workshop.create(req.body);
        res.status(201).json({ success: true, data: workshop });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Update workshop
 * @route   PUT /api/workshops/:id
 * @access  Private/WorkshopAdmin
 */
export const updateWorkshop = async (req, res) => {
    try {
        let workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ success: false, message: 'Not found' });

        // Optional logic: Restrict updates if registrations exist
        if (workshop.currentParticipants > 0) {
            const allowedUpdates = ['description', 'shortDescription', 'isFeatured', 'status', 'galleryImages'];
            const attemptedUpdates = Object.keys(req.body);
            const isViolation = attemptedUpdates.some(update => !allowedUpdates.includes(update));
            
            // if (isViolation) return res.status(400).json({ message: "Cannot change core details as registrations exist" });
        }

        if (req.file) req.body.image = req.file.path;

        Object.assign(workshop, req.body);
        await workshop.save(); // Triggers slug regeneration pre-save hook

        res.status(200).json({ success: true, data: workshop });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Delete workshop
 * @route   DELETE /api/workshops/:id
 * @access  Private/WorkshopAdmin
 */
export const deleteWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ success: false, message: 'Not found' });

        if (workshop.currentParticipants > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Registrations exist. Please cancel the workshop instead of deleting." 
            });
        }

        await workshop.deleteOne();
        res.status(200).json({ success: true, message: "Workshop removed" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Cancel workshop
 * @route   PUT /api/workshops/:id/cancel
 * @access  Private/WorkshopAdmin
 */
export const cancelWorkshop = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const workshop = await Workshop.findByIdAndUpdate(
            req.params.id, 
            { status: 'cancelled' }, 
            { new: true, session }
        );

        await Booking.updateMany(
            { workshop: req.params.id }, 
            { status: 'cancelled' }, 
            { session }
        );

        // TODO: Trigger email notifications logic here

        await session.commitTransaction();
        res.status(200).json({ success: true, message: "Workshop and bookings cancelled" });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: err.message });
    } finally {
        session.endSession();
    }
};

// ==================== REGISTRATION ====================

/**
 * @desc    Register for workshop
 * @route   POST /api/workshops/:id/register
 * @access  Public
 */
export const registerForWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        
        if (!workshop || workshop.status !== 'published') {
            return res.status(400).json({ message: 'Workshop unavailable' });
        }
        if (new Date(workshop.date) < new Date()) {
            return res.status(400).json({ message: 'Workshop date has passed' });
        }
        if (workshop.currentParticipants + req.body.numberOfSeats > workshop.maxParticipants) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const registration = await Booking.create({
            ...req.body,
            workshop: workshop._id,
            user: req.user ? req.user.id : null
        });

        // Booking post-save hook handles workshop participant count update
        res.status(201).json({ success: true, registrationNumber: registration.registrationNumber });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Email already registered for this workshop' });
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get registrations for a workshop
 * @route   GET /api/workshops/:id/registrations
 * @access  Private/WorkshopAdmin
 */
export const getWorkshopRegistrations = async (req, res) => {
    try {
        const registrations = await Booking.find({ workshop: req.params.id }).sort('-createdAt');
        
        const stats = {
            confirmed: registrations.filter(r => r.status === 'confirmed').length,
            cancelled: registrations.filter(r => r.status === 'cancelled').length,
            attended: registrations.filter(r => r.status === 'attended').length
        };

        res.status(200).json({ success: true, stats, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get all registrations (admin)
 * @route   GET /api/registrations
 * @access  Private/WorkshopAdmin
 */
export const getAllRegistrations = async (req, res) => {
    try {
        const { workshop, status, page = 1, limit = 20 } = req.query;
        let query = {};
        if (workshop) query.workshop = workshop;
        if (status) query.status = status;

        const registrations = await Booking.find(query)
            .populate('workshop', 'title date')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('-createdAt');

        res.status(200).json({ success: true, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get registration by registration number
 * @route   GET /api/registrations/:registrationNumber
 * @access  Public
 */
export const getRegistrationByNumber = async (req, res) => {
    try {
        const registration = await Booking.findOne({ registrationNumber: req.params.registrationNumber })
            .populate('workshop', 'title date venue startTime');

        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        const isAdmin = req.user && ['WorkshopAdmin', 'SuperAdmin'].includes(req.user.role);
        
        if (!isAdmin) {
            return res.status(200).json({ 
                success: true, 
                data: { 
                    registrationNumber: registration.registrationNumber, 
                    status: registration.status, 
                    workshop: registration.workshop,
                    participantName: registration.participantDetails.name 
                } 
            });
        }

        res.status(200).json({ success: true, data: registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Update registration status
 * @route   PUT /api/registrations/:id/status
 * @access  Private/WorkshopAdmin
 */
export const updateRegistrationStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const registration = await Booking.findById(req.params.id);
        if (!registration) return res.status(404).json({ message: 'Not found' });

        // If changing TO cancelled, update seats
        if (status === 'cancelled' && registration.status !== 'cancelled') {
            await Workshop.findByIdAndUpdate(registration.workshop, { $inc: { currentParticipants: -registration.numberOfSeats }});
        }
        // If changing FROM cancelled to confirmed, update seats
        if (status === 'confirmed' && registration.status === 'cancelled') {
            await Workshop.findByIdAndUpdate(registration.workshop, { $inc: { currentParticipants: registration.numberOfSeats }});
        }

        registration.status = status;
        if (notes) registration.notes = notes;
        await registration.save();

        res.status(200).json({ success: true, data: registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Cancel registration (by participant)
 * @route   PUT /api/registrations/:registrationNumber/cancel
 * @access  Public
 */
export const cancelRegistration = async (req, res) => {
    try {
        const { email, cancelReason } = req.body;
        const registration = await Booking.findOne({ 
            registrationNumber: req.params.registrationNumber, 
            'participantDetails.email': email 
        }).populate('workshop');

        if (!registration) return res.status(404).json({ message: 'Registration not found or email mismatch' });

        const hoursUntil = (new Date(registration.workshop.date) - new Date()) / (1000 * 60 * 60);
        if (hoursUntil < 24) return res.status(400).json({ message: 'Cannot cancel within 24 hours of workshop' });

        registration.status = 'cancelled';
        registration.cancelReason = cancelReason || 'User requested';
        registration.cancelledAt = Date.now();
        await registration.save();

        await Workshop.findByIdAndUpdate(registration.workshop._id, { $inc: { currentParticipants: -registration.numberOfSeats }});

        res.status(200).json({ success: true, message: 'Cancelled' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get workshop statistics
 * @route   GET /api/workshops/stats
 * @access  Private/WorkshopAdmin
 */
export const getWorkshopStats = async (req, res) => {
    try {
        const workshopCounts = await Workshop.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        const registrationCounts = await Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        const revenue = await Booking.aggregate([{ $match: { paymentStatus: 'completed' } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
        const popularTypes = await Workshop.aggregate([{ $group: { _id: "$type", totalParticipants: { $sum: "$currentParticipants" } } }]);
        const upcomingCount = await Workshop.countDocuments({ date: { $gte: new Date() }, status: 'published' });

        res.status(200).json({
            success: true,
            data: { workshopCounts, registrationCounts, revenue: revenue[0]?.total || 0, popularTypes, upcomingCount }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};