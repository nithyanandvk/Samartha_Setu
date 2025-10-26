const User = require('../models/User');
const Listing = require('../models/Listing');
const Checkpoint = require('../models/Checkpoint');
const Reward = require('../models/Reward');
const { createNotification, notificationTemplates } = require('../utils/notifications');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.setDate(now.getDate() - 7));

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalReceivers = await User.countDocuments({ role: 'receiver' });
    const totalListings = await Listing.countDocuments();
    
    // Today's stats
    const listingsToday = await Listing.countDocuments({
      createdAt: { $gte: today }
    });
    
    const completedToday = await Listing.countDocuments({
      status: 'completed',
      completedAt: { $gte: today }
    });

    // This week's stats
    const completedThisWeek = await Listing.countDocuments({
      status: 'completed',
      completedAt: { $gte: thisWeek }
    });

    // Calculate total KG saved
    const completedListings = await Listing.find({ status: 'completed' });
    const totalKgSaved = completedListings.reduce((sum, listing) => sum + listing.estimatedKg, 0);

    // Status breakdown
    const statusBreakdown = await Listing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Food type breakdown
    const foodTypeBreakdown = await Listing.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: '$foodType',
          count: { $sum: 1 },
          totalKg: { $sum: '$estimatedKg' }
        }
      }
    ]);

    // Pending verifications
    const pendingVerifications = await User.countDocuments({
      subtype: 'organization',
      isVerified: false
    });

    // Active checkpoints
    const activeCheckpoints = await Checkpoint.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          donors: totalDonors,
          receivers: totalReceivers
        },
        listings: {
          total: totalListings,
          today: listingsToday,
          completedToday,
          completedThisWeek
        },
        impact: {
          totalKgSaved: Math.round(totalKgSaved),
          mealsShared: Math.round(totalKgSaved / 0.3), // ~300g per meal
          completedDonations: completedListings.length
        },
        statusBreakdown,
        foodTypeBreakdown,
        pendingVerifications,
        activeCheckpoints
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
};

// @desc    Get pending verifications
// @route   GET /api/admin/verifications
// @access  Private (Admin)
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      subtype: 'organization',
      isVerified: false
    }).select('-password');

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending verifications'
    });
  }
};

// @desc    Verify organization
// @route   PUT /api/admin/verify/:userId
// @access  Private (Admin)
exports.verifyOrganization = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    await user.save();

    // Send notification
    const notifData = {
      recipient: user._id,
      sender: req.user.id,
      ...notificationTemplates.accountVerified()
    };
    
    await createNotification(req.io, notifData);

    res.status(200).json({
      success: true,
      message: 'Organization verified successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying organization'
    });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/ban/:userId
// @access  Private (Admin)
exports.toggleBanUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent banning admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    user.isBanned = !user.isBanned;
    
    if (user.isBanned) {
      user.banReason = reason || 'Violation of terms';
      user.bannedAt = new Date();

      // Send notification
      const notifData = {
        recipient: user._id,
        sender: req.user.id,
        ...notificationTemplates.accountBanned(user.banReason)
      };
      
      await createNotification(req.io, notifData);
    } else {
      user.banReason = null;
      user.bannedAt = null;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user ban status'
    });
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, subtype, isBanned, isVerified } = req.query;
    
    let query = {};
    
    if (role) query.role = role;
    if (subtype) query.subtype = subtype;
    if (isBanned !== undefined) query.isBanned = isBanned === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/admin/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topDonors = await User.find({ role: 'donor' })
      .select('name organizationName subtype points totalDonations totalKgShared badges averageRating')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: topDonors.length,
      leaderboard: topDonors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard'
    });
  }
};

// @desc    Export data as CSV
// @route   GET /api/admin/export
// @access  Private (Admin)
exports.exportData = async (req, res) => {
  try {
    const { type } = req.query; // 'listings', 'users', 'transactions'

    let data = [];
    let headers = '';

    if (type === 'listings') {
      const listings = await Listing.find()
        .populate('donor', 'name email')
        .populate('claimedBy', 'name email');
      
      headers = 'ID,Title,Food Type,Quantity,Status,Donor,Claimed By,Created At,Completed At,Estimated KG\n';
      data = listings.map(l => 
        `${l._id},"${l.title}",${l.foodType},${l.quantity.value} ${l.quantity.unit},${l.status},"${l.donor?.name || 'N/A'}","${l.claimedBy?.name || 'N/A'}",${l.createdAt},${l.completedAt || 'N/A'},${l.estimatedKg}`
      ).join('\n');
    } else if (type === 'users') {
      const users = await User.find().select('-password');
      
      headers = 'ID,Name,Email,Role,Subtype,Points,Total Donations,Total Received,Verified,Banned,Created At\n';
      data = users.map(u => 
        `${u._id},"${u.name}",${u.email},${u.role},${u.subtype},${u.points},${u.totalDonations},${u.totalReceived},${u.isVerified},${u.isBanned},${u.createdAt}`
      ).join('\n');
    }

    const csv = headers + data;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting data'
    });
  }
};

// @desc    Create checkpoint
// @route   POST /api/admin/checkpoints
// @access  Private (Admin)
exports.createCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.create({
      ...req.body,
      addedBy: req.user.id,
      isVerified: true,
      verifiedBy: req.user.id,
      verifiedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Checkpoint created successfully',
      checkpoint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating checkpoint'
    });
  }
};

// @desc    Get all checkpoints
// @route   GET /api/admin/checkpoints
// @access  Public
exports.getCheckpoints = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const checkpoints = await Checkpoint.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: checkpoints.length,
      checkpoints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching checkpoints'
    });
  }
};

// @desc    Update checkpoint
// @route   PUT /api/admin/checkpoints/:id
// @access  Private (Admin)
exports.updateCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!checkpoint) {
      return res.status(404).json({
        success: false,
        message: 'Checkpoint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Checkpoint updated successfully',
      checkpoint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating checkpoint'
    });
  }
};

// @desc    Create reward
// @route   POST /api/admin/rewards
// @access  Private (Admin)
exports.createReward = async (req, res) => {
  try {
    const reward = await Reward.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Reward created successfully',
      reward
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating reward'
    });
  }
};

// @desc    Get all rewards
// @route   GET /api/admin/rewards
// @access  Public
exports.getRewards = async (req, res) => {
  try {
    const { isActive, category } = req.query;
    
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (category) query.category = category;

    const rewards = await Reward.find(query).sort({ pointsRequired: 1 });

    res.status(200).json({
      success: true,
      count: rewards.length,
      rewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rewards'
    });
  }
};
