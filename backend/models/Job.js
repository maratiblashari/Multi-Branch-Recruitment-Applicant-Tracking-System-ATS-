const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['Islamabad', 'Lahore', 'Karachi', 'Remote'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: 1,
    },
    salary: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Manager'],
      default: 'Entry Level',
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Paused'],
      default: 'Open',
    },
    deadline: {
      type: Date,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for total applications count
jobSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true,
});

module.exports = mongoose.model('Job', jobSchema);
