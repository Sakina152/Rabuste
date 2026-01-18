import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add your phone number']
  },
  location: {
    type: String,
    required: [true, 'Please add the proposed location']
  },
  budget: {
    type: String,
    required: [true, 'Please select your budget range'],
    enum: ['10k-50k', '50k-100k', '100k+', '15L-25L', '25L-40L', '40L+']
  },
  experience: {
    type: String,
    required: [true, 'Please describe your experience']
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Franchise', franchiseSchema);