import Workshop from '../models/Workshop';
import Booking from '../models/Booking'; // Required for checking registrations
import mongoose from 'mongoose';

/**
 * @desc    Get all workshops (with filters)
 * @route   GET /api/workshops
 */
exports.getWorkshops = async (req, res) => {
    try {
        const { type, status, featured, upcoming, page = 1, limit = 10 } = req.query;
        let query = {};

        // Security: Public can only see 'published'. Admin (handled via middleware check) can see all.
        // Assuming req.user exists from auth middleware
        if (!req.user || req.user.role !== 'admin') {
            query.status = 'published';
        } else if (status) {
            query.status = status;
        }

        // Filters
        if (type) query.type = type;
        if (featured) query.isFeatured = featured === 'true';
        if (upcoming === 'true') query.date = { $gte: new Date() };

        // Pagination & Sorting
        const skip = (page - 1) * limit;
        const workshops = await Workshop.find(query)
            .sort({ date: 1 }) // Upcoming first
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Workshop.countDocuments(query);

        res.status(200).json({
            success: true,
            count: workshops.length,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
            data: workshops
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get single workshop by ID or slug
 * @route   GET /api/workshops/:identifier
 */
exports.getWorkshop = async (req, res) => {
    try {
        const { identifier } = req.params;
        
        // Determine if identifier is ObjectId or Slug
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
 * @desc    Get upcoming workshops (Top 6)
 * @route   GET /api/workshops/upcoming
 */
exports.getUpcomingWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({
            date: { $gte: new Date() },
            status: 'published'
        })
        .sort({ date: 1 })
        .limit(6);

        res.status(200).json({ success: true, count: workshops.length, data: workshops });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Create workshop
 * @route   POST /api/workshops
 */
exports.createWorkshop = async (req, res) => {
    try {
        // req.user.id comes from your auth middleware
        req.body.createdBy = req.user.id;

        // Note: If you use 'multer' for image upload, the path would be in req.file.path
        if (req.file) {
            req.body.image = req.file.path;
        }

        const workshop = await Workshop.create(req.body);

        res.status(201).json({ success: true, data: workshop });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Update workshop
 * @route   PUT /api/workshops/:id
 */
exports.updateWorkshop = async (req, res) => {
    try {
        let workshop = await Workshop.findById(req.params.id);

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'Workshop not found' });
        }

        // Business Rule: Check if registrations exist before allowing certain updates
        if (workshop.currentParticipants > 0) {
            // Optional: Block critical changes like price or date if people already paid
            // return res.status(400).json({ message: "Cannot modify workshop with active bookings" });
        }

        if (req.file) {
            req.body.image = req.file.path;
        }

        // Using findByIdAndUpdate triggers validators but not 'save' hooks unless configured. 
        // We use .save() here to ensure the slug-regeneration hook in our model runs.
        Object.assign(workshop, req.body);
        await workshop.save();

        res.status(200).json({ success: true, data: workshop });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Delete workshop
 * @route   DELETE /api/workshops/:id
 */
exports.deleteWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'Workshop not found' });
        }

        // Logic: Hard delete only if NO registrations. Otherwise, must cancel.
        if (workshop.currentParticipants > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete workshop with registrations. Use the Cancel route instead." 
            });
        }

        await workshop.deleteOne();
        res.status(200).json({ success: true, message: "Workshop deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Cancel workshop & all associated registrations
 * @route   PUT /api/workshops/:id/cancel
 */
exports.cancelWorkshop = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const workshop = await Workshop.findById(req.params.id).session(session);

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'Workshop not found' });
        }

        workshop.status = 'cancelled';
        await workshop.save({ session });

        // Bulk update all bookings to 'cancelled'
        await Booking.updateMany(
            { workshop: workshop._id },
            { status: 'cancelled' },
            { session }
        );

        // TODO: Trigger email notification logic here

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Workshop and all registrations cancelled" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: err.message });
    }
};