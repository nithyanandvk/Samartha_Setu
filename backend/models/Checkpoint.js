const mongoose = require('mongoose');

const checkpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a checkpoint name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['fridge', 'animal_farm', 'biocompost'],
    required: true
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
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  operatingHours: {
    open: String,
    close: String,
    days: [String]
  },
  capacity: {
    current: {
      type: Number,
      default: 0
    },
    maximum: {
      type: Number,
      default: 100
    }
  },
  acceptedFoodTypes: [{
    type: String,
    enum: ['cooked', 'raw', 'packaged', 'fruits', 'vegetables', 'dairy', 'bakery', 'mixed']
  }],
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Stats
  totalReceived: {
    type: Number,
    default: 0
  },
  totalKgReceived: {
    type: Number,
    default: 0
  },
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date
}, {
  timestamps: true
});

// Geospatial index
checkpointSchema.index({ location: '2dsphere' });
checkpointSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Checkpoint', checkpointSchema);
