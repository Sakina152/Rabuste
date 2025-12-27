import mongoose from 'mongoose';

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
        bio: { type: String },
        image: { type: String }
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
        type: Number // Calculated in minutes
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
workshopSchema.pre('save', function(next) {
    // Generate slug if title is modified
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    // Set isFree based on price
    this.isFree = this.price === 0;

    next();
});

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;