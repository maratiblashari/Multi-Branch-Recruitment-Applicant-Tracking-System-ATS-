const express = require('express');
const router = express.Router();
const {
  scheduleInterview, getAllInterviews, getMyInterviews,
  getInterviewById, updateInterview, deleteInterview,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, candidateOnly } = require('../middleware/roleMiddleware');

// Admin
router.post('/', protect, adminOnly, scheduleInterview);
router.get('/', protect, adminOnly, getAllInterviews);
router.put('/:id', protect, adminOnly, updateInterview);
router.delete('/:id', protect, adminOnly, deleteInterview);

// Candidate
router.get('/my', protect, candidateOnly, getMyInterviews);

// Both
router.get('/:id', protect, getInterviewById);

module.exports = router;
