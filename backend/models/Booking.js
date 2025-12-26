import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    workshop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: [true, 'Workshop reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Optional for guest checkouts
    },
    participantDetails: {
        name: { type: String, required: true },
        email: { 
            type: String, 
            required: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        phone: { type: String, required: true },
        age: { type: Number }
    },
    numberOfSeats: {
        type: Number,
        required: true,
        min: [1, 'Must book at least 1 seat'],
        max: [5, 'Maximum 5 seats per booking']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refunded', 'failed'],
        default: 'pending'
    },
    paymentId: { type: String },
    registrationNumber: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'attended', 'no-show'],
        default: 'confirmed'
    },
    specialRequirements: { type: String },
    source: {
        type: String,
        enum: ['website', 'walk-in', 'phone', 'instagram'],
        default: 'website'
    },
    notes: { type: String },
    cancelledAt: { type: Date },
    cancelReason: { type: String }
}, {
    timestamps: true
});

// --- Indexes ---
// Prevent duplicate registrations for the same workshop using the same email
bookingSchema.index({ workshop: 1, 'participantDetails.email': 1 }, { unique: true });
bookingSchema.index({ registrationNumber: 1 }, { unique: true });

// --- Pre-save Hook ---
bookingSchema.pre('save', async function(next) {
    // 1. Generate Registration Number if it doesn't exist
    if (!this.registrationNumber) {
        const date = new Date().getFullYear();
        const randomStr = Math.floor(10000 + Math.random() * 90000); // 5 digit random
        this.registrationNumber = `WS-${date}-${randomStr}`;
    }

    // 2. Calculate Total Amount
    // Note: This assumes the price is passed from the controller or 
    // we fetch the workshop price here.
    if (this.isModified('numberOfSeats') || !this.totalAmount) {
        const Workshop = mongoose.model('Workshop');
        const workshopDoc = await Workshop.findById(this.workshop);
        if (workshopDoc) {
            this.totalAmount = workshopDoc.price * this.numberOfSeats;
        }
    }

    next();
});

// --- Post-save Hook ---
bookingSchema.post('save', async function() {
    // Increment currentParticipants in the Workshop model
    const Workshop = mongoose.model('Workshop');
    await Workshop.findByIdAndUpdate(this.workshop, {
        $inc: { currentParticipants: this.numberOfSeats }
    });
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;