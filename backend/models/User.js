const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['donor', 'receiver', 'admin'],
    required: [true, 'Please specify a role']
  },
  subtype: {
    type: String,
    enum: ['individual', 'organization', 'charity', 'animal_farm', 'biocompost_collector', 'none'],
    default: 'individual'
  },
  organizationName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  // Verification for organizations
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String
  }],
  // Gamification
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    icon: String
  }],
  // Stats
  totalDonations: {
    type: Number,
    default: 0
  },
  totalReceived: {
    type: Number,
    default: 0
  },
  totalKgShared: {
    type: Number,
    default: 0
  },
  // Ratings
  averageRating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  // Moderation
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  bannedAt: Date,
  // Rewards
  rewardHistory: [{
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
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
  // Preferences
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: false
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 });
userSchema.index({ role: 1, subtype: 1 });
userSchema.index({ points: -1 }); // For leaderboard

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Auto-verify individuals and admins
userSchema.pre('save', function(next) {
  if (this.isNew && (this.subtype === 'individual' || this.role === 'admin')) {
    this.isVerified = true;
  }
  next();
});

// Award badges based on points
userSchema.methods.updateBadges = function() {
  const badgeThresholds = [
    { points: 10, name: 'First Steps', icon: '🌱' },
    { points: 50, name: 'Food Hero', icon: '🦸' },
    { points: 100, name: 'Community Champion', icon: '🏆' },
    { points: 250, name: 'Hunger Fighter', icon: '⭐' },
    { points: 500, name: 'Legend', icon: '👑' }
  ];

  badgeThresholds.forEach(badge => {
    if (this.points >= badge.points && !this.badges.some(b => b.name === badge.name)) {
      this.badges.push({
        name: badge.name,
        icon: badge.icon,
        earnedAt: new Date()
      });
    }
  });
};

module.exports = mongoose.model('User', userSchema);
