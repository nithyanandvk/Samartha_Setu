const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  foodType: {
    type: String,
    required: [true, 'Please specify food type'],
    enum: ['cooked', 'raw', 'packaged', 'fruits', 'vegetables', 'dairy', 'bakery', 'mixed'],
    default: 'mixed'
  },
  quantity: {
    value: {
      type: Number,
      required: [true, 'Please specify quantity']
    },
    unit: {
      type: String,
      enum: ['kg', 'servings', 'pieces', 'liters'],
      default: 'servings'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  pickupTimes: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Status management
  status: {
    type: String,
    enum: ['available', 'claimed', 'confirmed', 'completed', 'expired', 'cancelled'],
    default: 'available'
  },
  // Claim management
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: Date,
  confirmedAt: Date,
  completedAt: Date,
  // Fallback preferences
  fallbackPreference: {
    type: String,
    enum: ['receiver', 'animal_farm', 'biocompost', 'none'],
    default: 'receiver'
  },
  fallbackOrder: [{
    type: String,
    enum: ['receiver', 'animal_farm', 'biocompost']
  }],
  fallbackTriggered: {
    type: Boolean,
    default: false
  },
  fallbackAt: Date,
  // TTL and expiration
  expiresAt: {
    type: Date,
    required: true
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  // Bulk listing (for organizations)
  isBulk: {
    type: Boolean,
    default: false
  },
  bulkDetails: {
    totalQuantity: Number,
    itemsPerPerson: Number,
    maxReceivers: Number
  },
  // Receiver preferences
  preferredReceiverTypes: [{
    type: String,
    enum: ['individual', 'charity', 'animal_farm', 'biocompost_collector']
  }],
  // ETA and tracking
  receiverETA: {
    type: Number, // in minutes
    default: null
  },
  etaUpdatedAt: Date,
  // Ratings and feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ratedAt: Date,
  // Receiver feedback (thank you message)
  receiverFeedback: {
    message: {
      type: String,
      maxlength: 500
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  estimatedKg: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
listingSchema.index({ location: '2dsphere' });
listingSchema.index({ status: 1, expiresAt: 1 });
listingSchema.index({ donor: 1, status: 1 });
listingSchema.index({ claimedBy: 1, status: 1 });
listingSchema.index({ foodType: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

// Set default fallback order
listingSchema.pre('save', function(next) {
  if (this.isNew && this.fallbackOrder.length === 0) {
    this.fallbackOrder = ['receiver', 'animal_farm', 'biocompost'];
  }
  next();
});

// Calculate estimated kg based on quantity
listingSchema.pre('save', function(next) {
  if (this.isModified('quantity')) {
    const { value, unit } = this.quantity;
    
    // Rough estimation
    switch(unit) {
      case 'kg':
        this.estimatedKg = value;
        break;
      case 'servings':
        this.estimatedKg = value * 0.3; // ~300g per serving
        break;
      case 'pieces':
        this.estimatedKg = value * 0.2; // ~200g per piece
        break;
      case 'liters':
        this.estimatedKg = value * 1; // ~1kg per liter
        break;
      default:
        this.estimatedKg = value * 0.5;
    }
  }
  next();
});

// Virtual for time remaining
listingSchema.virtual('timeRemaining').get(function() {
  if (this.expiresAt) {
    return Math.max(0, this.expiresAt - Date.now());
  }
  return 0;
});

// Method to check if listing is expired
listingSchema.methods.checkExpiration = function() {
  if (this.expiresAt < Date.now() && this.status === 'available') {
    this.status = 'expired';
    this.isExpired = true;
    return true;
  }
  return false;
};

module.exports = mongoose.model('Listing', listingSchema);
