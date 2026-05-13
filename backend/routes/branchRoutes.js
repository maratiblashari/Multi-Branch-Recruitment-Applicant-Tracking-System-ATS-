const express = require('express');
const router = express.Router();
const {
  getBranches, getBranchById, createBranch, updateBranch, deleteBranch,
} = require('../controllers/branchController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Public
router.get('/', getBranches);
router.get('/:id', getBranchById);

// Admin
router.post('/', protect, adminOnly, createBranch);
router.put('/:id', protect, adminOnly, updateBranch);
router.delete('/:id', protect, adminOnly, deleteBranch);

module.exports = router;
