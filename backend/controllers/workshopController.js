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
            .sort({ date: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Workshop.countDocuments(query);

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            data: workshops
        });
    } catch (err) {
        console.error('Error fetching workshops:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
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

        const workshop = await Workshop.findOne(query)
            .populate('createdBy', 'name');

        if (!workshop) {
            return res.status(404).json({ 
                success: false, 
                message: 'Workshop not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: workshop 
        });
    } catch (err) {
        console.error('Error fetching workshop:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
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

        res.status(200).json({ 
            success: true, 
            data: workshops 
        });
    } catch (err) {
        console.error('Error fetching upcoming workshops:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
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

        res.status(200).json({ 
            success: true, 
            data: workshops 
        });
    } catch (err) {
        console.error('Error fetching featured workshops:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Create workshop
 * @route   POST /api/workshops
 * @access  Private/WorkshopAdmin
 */
export const createWorkshop = async (req, res) => {
  try {
    console.log("RAW BODY:", req.body);

    req.body.createdBy = req.user.id;

    // Normalize instructor
    if (req.body.instructorName && !req.body.instructor) {
      req.body.instructor = { name: req.body.instructorName };
      delete req.body.instructorName;
    }

    // Normalize status 🔥
    req.body.status = "published";

    // Normalize numbers
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.maxParticipants)
      req.body.maxParticipants = Number(req.body.maxParticipants);

    // Image
    if (req.file) {
      req.body.image = `/uploads/workshops/${req.file.filename}`;
    }

    const workshop = await Workshop.create(req.body);

    return res.status(201).json({
      success: true,
      data: workshop,
    });

  } catch (err) {
    console.error("CREATE WORKSHOP ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Workshop with same title already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map(e => e.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
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
        
        if (!workshop) {
            return res.status(404).json({ 
                success: false, 
                message: 'Workshop not found' 
            });
        }

        if (req.file) {
            req.body.image = `/uploads/workshops/${req.file.filename}`;
        }

        Object.assign(workshop, req.body);
        await workshop.save();

        res.status(200).json({ 
            success: true, 
            data: workshop 
        });
    } catch (err) {
        console.error('Error updating workshop:', err);
        res.status(400).json({ 
            success: false, 
            message: err.message 
        });
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

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        const hasRegistrations = await Booking.exists({
            workshop: req.params.id,
            status: { $ne: 'cancelled' }
        });

        if (hasRegistrations) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete workshop with active registrations. Cancel it instead.'
            });
        }

        await workshop.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Workshop deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting workshop:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
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
        await Workshop.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { session }
        );

        await Booking.updateMany(
            { workshop: req.params.id },
            { status: 'cancelled' },
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Workshop and all bookings cancelled'
        });
    } catch (err) {
        await session.abortTransaction();
        console.error('Error cancelling workshop:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
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
            return res.status(400).json({ 
                success: false,
                message: 'Workshop is not available for registration' 
            });
        }

        if (new Date(workshop.date) < new Date()) {
            return res.status(400).json({ 
                success: false,
                message: 'Workshop date has passed' 
            });
        }

        if (workshop.currentParticipants >= workshop.maxParticipants) {
            return res.status(400).json({ 
                success: false,
                message: 'Workshop is fully booked' 
            });
        }

        const registration = await Booking.create({
            ...req.body,
            workshop: workshop._id,
            user: req.user ? req.user.id : null,
            status: 'confirmed'
        });

        // Update participant count
        workshop.currentParticipants += 1;
        await workshop.save();

        res.status(201).json({ 
            success: true, 
            data: {
                registrationNumber: registration.registrationNumber,
                workshop: workshop.title,
                date: workshop.date
            }
        });
    } catch (err) {
        console.error('Error registering for workshop:', err);
        
        if (err.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: 'Email already registered for this workshop' 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Get registrations for a workshop
 * @route   GET /api/workshops/:id/registrations
 * @access  Private/WorkshopAdmin
 */
export const getWorkshopRegistrations = async (req, res) => {
    try {
        const registrations = await Booking.find({ 
            workshop: req.params.id 
        }).sort('-createdAt');

        res.status(200).json({ 
            success: true, 
            count: registrations.length,
            data: registrations 
        });
    } catch (err) {
        console.error('Error fetching workshop registrations:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Get all registrations
 * @route   GET /api/workshops/admin/registrations
 * @access  Private/WorkshopAdmin
 */
export const getAllRegistrations = async (req, res) => {
    try {
        const { status, workshop, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (workshop) query.workshop = workshop;

        const registrations = await Booking.find(query)
            .populate('workshop', 'title date')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            data: registrations
        });
    } catch (err) {
        console.error('Error fetching all registrations:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Get registration by number
 * @route   GET /api/workshops/registrations/:registrationNumber
 * @access  Public
 */
export const getRegistrationByNumber = async (req, res) => {
    try {
        const registration = await Booking.findOne({ 
            registrationNumber: req.params.registrationNumber 
        }).populate('workshop', 'title date');

        if (!registration) {
            return res.status(404).json({ 
                success: false,
                message: 'Registration not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: registration 
        });
    } catch (err) {
        console.error('Error fetching registration:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Update registration status
 * @route   PUT /api/workshops/registrations/:id/status
 * @access  Private/WorkshopAdmin
 */
export const updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const registration = await Booking.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ 
                success: false,
                message: 'Registration not found' 
            });
        }

        registration.status = status;
        await registration.save();

        res.status(200).json({ 
            success: true, 
            data: registration 
        });
    } catch (err) {
        console.error('Error updating registration status:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Cancel registration
 * @route   PUT /api/workshops/registrations/:registrationNumber/cancel
 * @access  Public
 */
export const cancelRegistration = async (req, res) => {
    try {
        const { email } = req.body;
        
        const registration = await Booking.findOne({
            registrationNumber: req.params.registrationNumber,
            'participantDetails.email': email
        }).populate('workshop');

        if (!registration) {
            return res.status(404).json({ 
                success: false,
                message: 'Registration not found or email does not match' 
            });
        }

        if (registration.status === 'cancelled') {
            return res.status(400).json({ 
                success: false,
                message: 'Registration is already cancelled' 
            });
        }

        registration.status = 'cancelled';
        registration.cancelledAt = new Date();
        await registration.save();

        // Update workshop participant count
        if (registration.workshop) {
            registration.workshop.currentParticipants = Math.max(
                0,
                registration.workshop.currentParticipants - 1
            );
            await registration.workshop.save();
        }

        res.status(200).json({ 
            success: true, 
            message: 'Registration cancelled successfully' 
        });
    } catch (err) {
        console.error('Error cancelling registration:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Get workshop statistics
 * @route   GET /api/workshops/admin/stats
 * @access  Private/WorkshopAdmin
 */
export const getWorkshopStats = async (req, res) => {
    try {
        const stats = {
            totalWorkshops: await Workshop.countDocuments(),
            upcomingWorkshops: await Workshop.countDocuments({ 
                date: { $gte: new Date() } 
            }),
            totalRegistrations: await Booking.countDocuments(),
            activeRegistrations: await Booking.countDocuments({ 
                status: 'confirmed' 
            }),
            revenue: 0 // This would be calculated based on your payment processing
        };

        res.status(200).json({ 
            success: true, 
            data: stats 
        });
    } catch (err) {
        console.error('Error fetching workshop stats:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Force delete workshop (admin only)
 * @route   DELETE /api/workshops/:id/force
 * @access  Private/Admin
 */
export const forceDeleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    // 1. Delete all bookings related to this workshop
    await Booking.deleteMany({ workshop: workshop._id });

    // 2. Delete the workshop
    await workshop.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Workshop and all registrations deleted permanently',
    });
  } catch (err) {
    console.error('Force delete workshop error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};