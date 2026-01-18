import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    workshop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: [true, 'Workshop reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
bookingSchema.index({ workshop: 1, 'participantDetails.email': 1 }, { unique: true });
// Duplicate index definition removed: bookingSchema.index({ registrationNumber: 1 }, { unique: true });

// --- FIXED Pre-save Hook ---
// We remove 'next' and rely on the async/await promise resolution
bookingSchema.pre('save', async function () {
    // 1. Generate Registration Number
    if (!this.registrationNumber) {
        const date = new Date().getFullYear();
        const randomStr = Math.floor(10000 + Math.random() * 90000);
        this.registrationNumber = `WS-${date}-${randomStr}`;
    }

    // 2. Calculate Total Amount based on Workshop Price (Source of Truth)
    const Workshop = mongoose.model('Workshop');
    const workshopDoc = await Workshop.findById(this.workshop);
    if (workshopDoc) {
        this.totalAmount = workshopDoc.price * (this.numberOfSeats || 1);
    }
});
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;