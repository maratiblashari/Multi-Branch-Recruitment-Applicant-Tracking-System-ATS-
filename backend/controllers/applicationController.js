const Application = require('../models/Application');
const Job = require('../models/Job');
const {
  sendShortlistEmail,
  sendRejectionEmail,
  sendSelectionEmail,
  sendCustomEmail,
} = require('../config/nodemailer');

// @desc    Submit a job application
// @route   POST /api/applications
// @access  Private/Candidate
const submitApplication = async (req, res) => {
  try {
    const { jobId, coverLetterText } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'Open') return res.status(400).json({ message: 'This job is no longer accepting applications' });

    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    const resumeUrl = req.user.resumeUrl || (req.file ? req.file.path : '');
    if (!resumeUrl) return res.status(400).json({ message: 'Please upload a resume before applying' });

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
      coverLetterUrl: req.user.coverLetterUrl || '',
      coverLetterText,
    });

    const populated = await Application.findById(application._id)
      .populate('job', 'title branch department')
      .populate('candidate', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for logged-in candidate
// @route   GET /api/applications/my
// @access  Private/Candidate
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title branch department status salary jobType')
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a specific job (Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone city profilePic skills education experience resumeUrl coverLetterUrl')
      .populate('job', 'title branch department')
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate('candidate', 'name email phone profilePic')
      .populate('job', 'title branch department')
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email phone city profilePic skills education experience resumeUrl coverLetterUrl')
      .populate('job', 'title branch department salary jobType');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Candidates can only see their own applications
    if (req.user.role === 'candidate' && application.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, hrNotes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email')
      .populate('job', 'title branch');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status || application.status;
    application.hrNotes = hrNotes || application.hrNotes;
    await application.save();

    const { name, email } = application.candidate;
    const { title, branch } = application.job;

    // Send status-based email
    try {
      if (status === 'Shortlisted') {
        await sendShortlistEmail(email, name, title, branch);
      } else if (status === 'Rejected') {
        await sendRejectionEmail(email, name, title);
      } else if (status === 'Selected') {
        await sendSelectionEmail(email, name, title, branch);
      }
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send custom email to candidate (Admin)
// @route   POST /api/applications/:id/email
// @access  Private/Admin
const sendEmailToCandidate = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    await sendCustomEmail(application.candidate.email, application.candidate.name, subject, message);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  sendEmailToCandidate,
};
