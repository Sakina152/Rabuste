import mongoose from 'mongoose';

const workshopInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['private-tasting', 'corporate-workshop', 'art-exhibition', 'community-gathering', 'birthday', 'other']
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: 1
  },
  preferredDate: {
    type: Date,
    required: false
  },
  message: {
    type: String,
    required: false,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'rejected'],
    default: 'pending'
  },
  inquiryNumber: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Auto-generate inquiry number
workshopInquirySchema.pre('save', async function (next) {
  if (!this.inquiryNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.inquiryNumber = `INQ${date}${random}`;
  }
  next();
});

const WorkshopInquiry = mongoose.model('WorkshopInquiry', workshopInquirySchema);
export default WorkshopInquiry;
