const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume is required'],
    },
    coverLetterUrl: {
      type: String,
      default: '',
    },
    coverLetterText: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Rejected',
        'Selected',
      ],
      default: 'Submitted',
    },
    hrNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
