const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a reward name'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  pointsRequired: {
    type: Number,
    required: [true, 'Please specify points required'],
    min: 0
  },
  category: {
    type: String,
    enum: ['gift', 'certificate', 'badge', 'voucher', 'recognition'],
    default: 'gift'
  },
  image: {
    type: String
  },
  quantity: {
    available: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date
  },
  // Eligibility
  minDonations: {
    type: Number,
    default: 0
  },
  minRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // Tracking
  claimedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    claimedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'issued', 'delivered'],
      default: 'pending'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
rewardSchema.index({ pointsRequired: 1, isActive: 1 });
rewardSchema.index({ category: 1 });

// Check if user is eligible
rewardSchema.methods.isEligible = function(user) {
  if (!this.isActive) return false;
  if (this.quantity.available <= 0) return false;
  if (user.points < this.pointsRequired) return false;
  if (user.totalDonations < this.minDonations) return false;
  if (user.averageRating < this.minRating) return false;
  if (this.expiryDate && this.expiryDate < Date.now()) return false;
  
  return true;
};

module.exports = mongoose.model('Reward', rewardSchema);
