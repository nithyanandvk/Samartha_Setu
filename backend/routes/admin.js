const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingVerifications,
  verifyOrganization,
  toggleBanUser,
  getAllUsers,
  getLeaderboard,
  exportData,
  createCheckpoint,
  getCheckpoints,
  updateCheckpoint,
  createReward,
  getRewards
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/checkpoints', getCheckpoints);
router.get('/rewards', getRewards);

// Admin only routes
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/verifications', getPendingVerifications);
router.put('/verify/:userId', verifyOrganization);
router.put('/ban/:userId', toggleBanUser);
router.get('/users', getAllUsers);
router.get('/export', exportData);

// Checkpoint management
router.post('/checkpoints', createCheckpoint);
router.put('/checkpoints/:id', updateCheckpoint);

// Reward management
router.post('/rewards', createReward);

module.exports = router;
