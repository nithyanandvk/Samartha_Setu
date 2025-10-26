const Listing = require('../models/Listing');
const User = require('../models/User');
const { createNotification, notificationTemplates } = require('../utils/notifications');

// @desc    Rate a completed listing
// @route   POST /api/listings/:id/rate
// @access  Private
exports.rateListing = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const listingId = req.params.id;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing is completed
    if (listing.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed listings'
      });
    }

    // Check if user is participant
    const isDonor = listing.donor.toString() === req.user.id;
    const isReceiver = listing.claimedBy && listing.claimedBy.toString() === req.user.id;

    if (!isDonor && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this listing'
      });
    }

    // Check if already rated
    if (isDonor && listing.rating.donorRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this listing'
      });
    }

    if (isReceiver && listing.rating.receiverRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this listing'
      });
    }

    // Add rating
    if (isDonor) {
      listing.rating.donorRating = rating;
      listing.rating.donorFeedback = feedback || '';
      listing.rating.donorRatedAt = new Date();
    } else {
      listing.rating.receiverRating = rating;
      listing.rating.receiverFeedback = feedback || '';
      listing.rating.receiverRatedAt = new Date();
    }

    await listing.save();

    // Update user's average rating
    const ratedUser = isDonor ? listing.claimedBy : listing.donor;
    await updateUserRating(ratedUser);

    // Check for auto-ban
    if (!isDonor) {
      await checkAndBanLowRatedDonor(listing.donor);
    }

    // Send notification
    const notifData = {
      recipient: ratedUser,
      sender: req.user.id,
      relatedListing: listing._id,
      ...notificationTemplates.receivedRating(rating)
    };
    
    await createNotification(req.io, notifData);

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      listing
    });
  } catch (error) {
    console.error('Rate listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating'
    });
  }
};

// Helper function to update user rating
async function updateUserRating(userId) {
  try {
    const donorListings = await Listing.find({
      donor: userId,
      status: 'completed',
      'rating.receiverRating': { $exists: true, $ne: null }
    });

    const receiverListings = await Listing.find({
      claimedBy: userId,
      status: 'completed',
      'rating.donorRating': { $exists: true, $ne: null }
    });

    let totalRating = 0;
    let totalCount = 0;

    donorListings.forEach(listing => {
      if (listing.rating.receiverRating) {
        totalRating += listing.rating.receiverRating;
        totalCount++;
      }
    });

    receiverListings.forEach(listing => {
      if (listing.rating.donorRating) {
        totalRating += listing.rating.donorRating;
        totalCount++;
      }
    });

    const averageRating = totalCount > 0 ? totalRating / totalCount : 0;

    await User.findByIdAndUpdate(userId, {
      averageRating: averageRating.toFixed(2),
      totalRatings: totalCount
    });

  } catch (error) {
    console.error('Update user rating error:', error);
  }
}

// Helper function to check and ban low-rated donors
async function checkAndBanLowRatedDonor(donorId) {
  try {
    const donor = await User.findById(donorId);

    if (!donor || donor.role !== 'donor') {
      return;
    }

    if (donor.totalRatings >= 5 && donor.averageRating < 2) {
      donor.isBanned = true;
      donor.banReason = 'Automatically banned due to low ratings';
      donor.bannedAt = new Date();
      await donor.save();
    }
  } catch (error) {
    console.error('Check and ban donor error:', error);
  }
}

module.exports = exports;
