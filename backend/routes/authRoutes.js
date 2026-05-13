const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, getProfile, updateProfile,
  uploadProfilePic, uploadResume, uploadCoverLetter, getAllUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
  uploadProfilePic: uploadPicMiddleware,
  uploadResume: uploadResumeMiddleware,
  uploadCoverLetter: uploadCoverLetterMiddleware,
} = require('../config/cloudinary');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/pic', protect, uploadPicMiddleware.single('profilePic'), uploadProfilePic);
router.put('/profile/resume', protect, uploadResumeMiddleware.single('resume'), uploadResume);
router.put('/profile/coverletter', protect, uploadCoverLetterMiddleware.single('coverLetter'), uploadCoverLetter);

// Admin only
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
