import mongoose from 'mongoose';

/**
 * Utility function to create a URL-friendly slug
 * without using external libraries.
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

const workshopSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    shortDescription: {
        type: String,
        maxLength: [300, 'Short Description cannot exceed 300 characters'],
    },
    type: {
        type: String,
        required: [true, 'Workshop type is required'],
        enum: ['coffee', 'art', 'community', 'special']
    },
    instructor: {
        name: { type: String, required: true },
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    duration: {
        type: Number // In minutes
    },
    venue: {
        type: String,
        default: "Rabuste Coffee Café"
    },
    address: {
        type: String
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Maximum participants is required'],
        min: [1, 'Must have at least 1 participant']
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    isFree: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    galleryImages: [String],
    requirements: [String],
    highlights: [String],
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// --- Indexes ---
workshopSchema.index({ date: 1, status: 1 });
workshopSchema.index({ type: 1 });
workshopSchema.index({ slug: 1 }, { unique: true });

// --- Virtual Fields ---
workshopSchema.virtual('availableSeats').get(function() {
    return this.maxParticipants - this.currentParticipants;
});

workshopSchema.virtual('isFullyBooked').get(function() {
    return this.currentParticipants >= this.maxParticipants;
});

workshopSchema.virtual('isPast').get(function() {
    return this.date < new Date();
});

// --- Pre-save Hook ---
// Removed the 'next' parameter to prevent "next is not a function" errors.
// Modern Mongoose handles hooks that return nothing or a promise automatically.
workshopSchema.pre('save', function() {
    if (this.isModified('title')) {
        this.slug = createSlug(this.title);
    }

    this.isFree = this.price === 0;
});

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;