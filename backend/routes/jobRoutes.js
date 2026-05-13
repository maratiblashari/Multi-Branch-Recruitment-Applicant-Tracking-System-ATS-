const express = require('express');
const router = express.Router();
const {
  getJobs, getAllJobsAdmin, getJobById,
  createJob, updateJob, deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Public
router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin only
router.get('/admin/all', protect, adminOnly, getAllJobsAdmin);
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;
