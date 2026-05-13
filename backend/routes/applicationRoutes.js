const express = require('express');
const router = express.Router();
const {
  submitApplication, getMyApplications, getApplicationsByJob,
  getAllApplications, getApplicationById,
  updateApplicationStatus, sendEmailToCandidate,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, candidateOnly } = require('../middleware/roleMiddleware');

// Candidate
router.post('/', protect, candidateOnly, submitApplication);
router.get('/my', protect, candidateOnly, getMyApplications);

// Admin
router.get('/', protect, adminOnly, getAllApplications);
router.get('/job/:jobId', protect, adminOnly, getApplicationsByJob);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);
router.post('/:id/email', protect, adminOnly, sendEmailToCandidate);

// Both roles
router.get('/:id', protect, getApplicationById);

module.exports = router;
