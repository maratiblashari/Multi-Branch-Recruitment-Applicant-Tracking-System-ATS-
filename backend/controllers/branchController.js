const Branch = require('../models/Branch');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get branch by ID
// @route   GET /api/branches/:id
// @access  Public
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create branch
// @route   POST /api/branches
// @access  Private/Admin
const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Branch already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    await branch.deleteOne();
    res.json({ message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBranches, getBranchById, createBranch, updateBranch, deleteBranch };
