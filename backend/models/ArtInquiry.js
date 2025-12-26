import mongoose from 'mongoose';

const artInquirySchema = new mongoose.Schema({
  artId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Art',
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true
  },
  phone: String,
  message: {
    type: String,
    required: [true, 'Please let us know your specific interest or question']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Closed'],
    default: 'New'
  }
}, { timestamps: true });

const ArtInquiry = mongoose.model("ArtInquiry", artInquirySchema);

export default ArtInquiry;