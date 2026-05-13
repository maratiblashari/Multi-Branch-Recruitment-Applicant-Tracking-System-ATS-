const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { sendInterviewEmail } = require('../config/nodemailer');

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private/Admin
const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledDate, scheduledTime, interviewType, meetingLink, message } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidate', 'name email')
      .populate('job', 'title branch');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.status !== 'Shortlisted') {
      return res.status(400).json({ message: 'Candidate must be shortlisted before scheduling an interview' });
    }

    // Check if interview already exists
    const existing = await Interview.findOne({ application: applicationId });
    if (existing) return res.status(400).json({ message: 'Interview already scheduled for this application' });

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      job: application.job._id,
      scheduledDate,
      scheduledTime,
      interviewType,
      meetingLink,
      message,
      scheduledBy: req.user._id,
    });

    // Update application status
    application.status = 'Interview Scheduled';
    await application.save();

    // Send interview email
    try {
      const dateStr = new Date(scheduledDate).toLocaleDateString('en-PK', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      await sendInterviewEmail(
        application.candidate.email,
        application.candidate.name,
        application.job.title,
        dateStr,
        scheduledTime,
        message,
      );
    } catch (emailErr) {
      console.error('Interview email failed:', emailErr.message);
    }

    const populated = await Interview.findById(interview._id)
      .populate('candidate', 'name email phone')
      .populate('job', 'title branch department')
      .populate('application');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all interviews (Admin)
// @route   GET /api/interviews
// @access  Private/Admin
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({})
      .populate('candidate', 'name email phone profilePic')
      .populate('job', 'title branch department')
      .populate('application', 'status resumeUrl')
      .sort('scheduledDate');
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews for logged-in candidate
// @route   GET /api/interviews/my
// @access  Private/Candidate
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .populate('job', 'title branch department salary')
      .populate('application', 'status')
      .sort('scheduledDate');
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email phone profilePic')
      .populate('job', 'title branch department')
      .populate('application');

    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private/Admin
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
      .populate('candidate', 'name email')
      .populate('job', 'title branch');

    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private/Admin
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    await interview.deleteOne();
    res.json({ message: 'Interview cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getAllInterviews,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
