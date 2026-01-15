import mongoose from 'mongoose';

const artistSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  portfolio: [{
    type: String, // Array of URLs
    required: true,
  }],
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const ArtistSubmission = mongoose.model('ArtistSubmission', artistSubmissionSchema);

export default ArtistSubmission;
