const Listing = require('../models/Listing');
const User = require('../models/User');
const Chat = require('../models/Chat');
const { createNotification, notificationTemplates } = require('../utils/notifications');
const { deleteImage } = require('../config/cloudinary');

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Donor)
exports.createListing = async (req, res) => {
  try {
    // Parse FormData - handle both nested objects and flat structure
    let quantity, location, pickupTimes;
    
    // Check if data is already parsed as objects (JSON) or needs parsing (FormData)
    if (typeof req.body.quantity === 'object') {
      quantity = req.body.quantity;
    } else {
      // Parse from FormData format: quantity[value], quantity[unit]
      quantity = {
        value: parseFloat(req.body['quantity[value]'] || req.body.quantityValue),
        unit: req.body['quantity[unit]'] || req.body.quantityUnit
      };
    }

    if (typeof req.body.location === 'object') {
      location = req.body.location;
    } else {
      // Parse from FormData format
      location = {
        type: req.body['location[type]'] || 'Point',
        coordinates: [
          parseFloat(req.body['location[coordinates][0]'] || req.body.longitude),
          parseFloat(req.body['location[coordinates][1]'] || req.body.latitude)
        ],
        address: req.body['location[address]'] || req.body.address
      };
    }

    if (typeof req.body.pickupTimes === 'object') {
      pickupTimes = req.body.pickupTimes;
    } else {
      // Parse from FormData format
      pickupTimes = {
        start: new Date(req.body['pickupTimes[start]'] || req.body.pickupStart),
        end: new Date(req.body['pickupTimes[end]'] || req.body.pickupEnd)
      };
    }

    const {
      title,
      description,
      foodType,
      fallbackPreference,
      isBulk,
      bulkDetails,
      preferredReceiverTypes
    } = req.body;

    // Validate location coordinates
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid location coordinates [longitude, latitude]'
      });
    }

    const [longitude, latitude] = location.coordinates;
    if (isNaN(longitude) || isNaN(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.'
      });
    }

    // Calculate estimated KG based on quantity
    let estimatedKg = 0;
    if (quantity.unit === 'kg') {
      estimatedKg = quantity.value;
    } else if (quantity.unit === 'servings') {
      estimatedKg = quantity.value * 0.3; // ~300g per serving
    } else if (quantity.unit === 'liters') {
      estimatedKg = quantity.value * 1; // 1L ≈ 1kg
    } else if (quantity.unit === 'pieces') {
      estimatedKg = quantity.value * 0.2; // ~200g per piece
    }

    // Calculate expiration time (default 2 hours from now)
    const ttlMinutes = parseInt(process.env.LISTING_TTL_MINUTES) || 120;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Get uploaded images from middleware
    const uploadedImages = req.uploadedImages || [];

    // Create listing
    const listing = await Listing.create({
      donor: req.user.id,
      title,
      description,
      foodType,
      quantity,
      estimatedKg,
      location,
      pickupTimes,
      images: uploadedImages,
      fallbackPreference: fallbackPreference || 'receiver',
      expiresAt,
      isBulk: isBulk || false,
      bulkDetails,
      preferredReceiverTypes: preferredReceiverTypes || []
    });

    // Populate donor info
    await listing.populate('donor', 'name email organizationName subtype');

    // Emit real-time event
    if (req.io) {
      req.io.emit('new_listing', listing);
    }

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating listing'
    });
  }
};

// @desc    Get all listings with filters
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res) => {
  try {
    const {
      status,
      foodType,
      latitude,
      longitude,
      radius, // in kilometers
      immediatePickup
    } = req.query;

    // Build query
    let query = { isExpired: false };

    if (status) {
      query.status = status;
    } else {
      query.status = 'available'; // Default to available
    }

    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }

    // Geospatial query
    if (latitude && longitude) {
      const radiusInMeters = (radius || 10) * 1000; // Default 10km
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      };
    }

    // Immediate pickup filter
    if (immediatePickup === 'true') {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      query['pickupTimes.start'] = { $lte: oneHourLater };
    }

    const listings = await Listing.find(query)
      .populate('donor', 'name organizationName subtype location averageRating')
      .populate('claimedBy', 'name subtype')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings'
    });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('donor', 'name email organizationName subtype location phone averageRating totalDonations')
      .populate('claimedBy', 'name email subtype phone');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching listing'
    });
  }
};

// @desc    Claim a listing
// @route   POST /api/listings/:id/claim
// @access  Private (Receiver)
exports.claimListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('donor', 'name email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing is available
    if (listing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not available for claiming'
      });
    }

    // Check if expired
    if (listing.checkExpiration()) {
      await listing.save();
      return res.status(400).json({
        success: false,
        message: 'Listing has expired'
      });
    }

    // Update listing
    listing.status = 'claimed';
    listing.claimedBy = req.user.id;
    listing.claimedAt = new Date();
    await listing.save();

    // Create chat for this listing
    let chat = await Chat.findOne({ listing: listing._id });
    if (!chat) {
      chat = await Chat.create({
        listing: listing._id,
        participants: [listing.donor._id, req.user.id],
        messages: []
      });
    }

    // Send notification to donor
    const notifData = {
      recipient: listing.donor._id,
      sender: req.user.id,
      relatedListing: listing._id,
      ...notificationTemplates.listingClaimed(req.user.name, listing.title)
    };
    
    await createNotification(req.io, notifData);

    // Emit real-time event
    if (req.io) {
      req.io.to(listing.donor._id.toString()).emit('listing_claimed', {
        listing,
        claimedBy: req.user
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing claimed successfully. Waiting for donor confirmation.',
      listing,
      chatId: chat._id
    });
  } catch (error) {
    console.error('Claim listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error claiming listing'
    });
  }
};

// @desc    Confirm or reject a claim
// @route   POST /api/listings/:id/confirm
// @access  Private (Donor)
exports.confirmClaim = async (req, res) => {
  try {
    const { action } = req.body; // 'confirm' or 'reject'
    
    const listing = await Listing.findById(req.params.id)
      .populate('claimedBy', 'name email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership
    if (listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this listing'
      });
    }

    if (listing.status !== 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not in claimed status'
      });
    }

    if (action === 'confirm') {
      listing.status = 'confirmed';
      listing.confirmedAt = new Date();
      await listing.save();

      // Notify receiver
      const notifData = {
        recipient: listing.claimedBy._id,
        sender: req.user.id,
        relatedListing: listing._id,
        ...notificationTemplates.claimConfirmed(req.user.name, listing.title)
      };
      
      await createNotification(req.io, notifData);

      // Emit real-time event
      if (req.io) {
        req.io.to(listing.claimedBy._id.toString()).emit('claim_confirmed', listing);
      }

      res.status(200).json({
        success: true,
        message: 'Claim confirmed successfully',
        listing
      });
    } else if (action === 'reject') {
      listing.status = 'available';
      listing.claimedBy = null;
      listing.claimedAt = null;
      await listing.save();

      // Notify receiver
      const notifData = {
        recipient: listing.claimedBy._id,
        relatedListing: listing._id,
        ...notificationTemplates.claimRejected(listing.title)
      };
      
      await createNotification(req.io, notifData);

      res.status(200).json({
        success: true,
        message: 'Claim rejected',
        listing
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }
  } catch (error) {
    console.error('Confirm claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing claim confirmation'
    });
  }
};

// @desc    Complete a listing
// @route   POST /api/listings/:id/complete
// @access  Private (Donor or Receiver)
exports.completeListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('donor', 'name points totalDonations totalKgShared')
      .populate('claimedBy', 'name totalReceived');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check authorization
    const isAuthorized = listing.donor._id.toString() === req.user.id || 
                        (listing.claimedBy && listing.claimedBy._id.toString() === req.user.id);
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this listing'
      });
    }

    if (listing.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Listing must be confirmed before completion'
      });
    }

    listing.status = 'completed';
    listing.completedAt = new Date();
    await listing.save();

    // Award points to donor
    const pointsEarned = Math.ceil(listing.estimatedKg * 10); // 10 points per kg
    const donor = await User.findById(listing.donor._id);
    donor.points += pointsEarned;
    donor.totalDonations += 1;
    donor.totalKgShared += listing.estimatedKg;
    donor.updateBadges();
    await donor.save();

    // Update receiver stats
    if (listing.claimedBy) {
      const receiver = await User.findById(listing.claimedBy._id);
      receiver.totalReceived += 1;
      await receiver.save();
    }

    // Notify donor
    const notifData = {
      recipient: listing.donor._id,
      relatedListing: listing._id,
      ...notificationTemplates.listingCompleted(listing.title, pointsEarned)
    };
    
    await createNotification(req.io, notifData);

    res.status(200).json({
      success: true,
      message: 'Listing completed successfully',
      listing,
      pointsEarned
    });
  } catch (error) {
    console.error('Complete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing listing'
    });
  }
};

// @desc    Update listing ETA
// @route   PUT /api/listings/:id/eta
// @access  Private (Receiver)
exports.updateETA = async (req, res) => {
  try {
    const { eta } = req.body; // ETA in minutes

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (!listing.claimedBy || listing.claimedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    listing.receiverETA = eta;
    listing.etaUpdatedAt = new Date();
    await listing.save();

    // Notify donor
    if (req.io) {
      req.io.to(listing.donor.toString()).emit('eta_updated', {
        listingId: listing._id,
        eta
      });
    }

    res.status(200).json({
      success: true,
      message: 'ETA updated',
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ETA'
    });
  }
};

// @desc    Get user's listings (donor)
// @route   GET /api/listings/my/donations
// @access  Private (Donor)
exports.getMyDonations = async (req, res) => {
  try {
    const listings = await Listing.find({ donor: req.user.id })
      .populate('claimedBy', 'name subtype phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
};

// @desc    Get user's claimed listings (receiver)
// @route   GET /api/listings/my/claims
// @access  Private (Receiver)
exports.getMyClaims = async (req, res) => {
  try {
    const listings = await Listing.find({ claimedBy: req.user.id })
      .populate('donor', 'name organizationName subtype phone location')
      .sort({ claimedAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claims'
    });
  }
};

// @desc    Cancel listing
// @route   DELETE /api/listings/:id
// @access  Private (Donor)
exports.cancelListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const image of listing.images) {
        try {
          await deleteImage(image.publicId);
        } catch (error) {
          console.error('Error deleting image:', error);
          // Continue even if image deletion fails
        }
      }
    }

    listing.status = 'cancelled';
    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing cancelled'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling listing'
    });
  }
};

// @desc    Send feedback/thank you message to donor
// @route   POST /api/listings/:id/feedback
// @access  Private (Receiver)
exports.sendFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;
    const listing = await Listing.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('receiver', 'name');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is the receiver
    if (listing.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send feedback for this listing'
      });
    }

    // Check if listing is completed
    if (listing.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only send feedback for completed listings'
      });
    }

    // Add feedback to listing
    listing.receiverFeedback = {
      message,
      rating: rating || 5,
      createdAt: Date.now()
    };
    await listing.save();

    // Create notification for donor
    await createNotification({
      recipient: listing.donor._id,
      type: 'feedback_received',
      title: '💬 Feedback Received!',
      message: `${listing.receiver.name} sent you a thank you message for "${listing.title}"`,
      link: `/donor/dashboard`,
      data: {
        listingId: listing._id,
        listingTitle: listing.title,
        receiverName: listing.receiver.name,
        feedback: message
      }
    });

    res.status(200).json({
      success: true,
      message: 'Thank you message sent successfully!',
      data: listing
    });
  } catch (error) {
    console.error('Send feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending feedback'
    });
  }
};
