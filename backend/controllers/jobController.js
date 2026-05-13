const Job = require('../models/Job');

// @desc    Get all open jobs (with optional filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { branch, department, search, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    else filter.status = 'Open';

    if (branch) filter.branch = branch;
    if (department) filter.department = new RegExp(department, 'i');
    if (search) filter.title = new RegExp(search, 'i');

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort('-createdAt');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (Admin - no filter)
// @route   GET /api/jobs/all
// @access  Private/Admin
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate('postedBy', 'name email')
      .sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const {
      title, description, requirements, department,
      branch, availableSeats, salary, jobType,
      experienceLevel, status, deadline,
    } = req.body;

    const job = await Job.create({
      title, description, requirements, department,
      branch, availableSeats, salary, jobType,
      experienceLevel, status, deadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getAllJobsAdmin,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
