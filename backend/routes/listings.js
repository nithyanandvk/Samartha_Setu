const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListing,
  claimListing,
  confirmClaim,
  completeListing,
  updateETA,
  getMyDonations,
  getMyClaims,
  cancelListing,
  sendFeedback
} = require('../controllers/listingController');
const { rateListing } = require('../controllers/ratingController');
const { protect, authorize, requireVerified } = require('../middleware/auth');
const { listingLimiter, claimLimiter } = require('../middleware/rateLimiter');
const { uploadListingImages, handleUploadError, processUploadedImages } = require('../middleware/imageUpload');

// Public routes
router.get('/', getListings);
router.get('/:id', getListing);

// Protected routes - Donor
router.post('/', protect, authorize('donor'), listingLimiter, uploadListingImages, handleUploadError, processUploadedImages, createListing);
router.get('/my/donations', protect, authorize('donor'), getMyDonations);
router.post('/:id/confirm', protect, authorize('donor'), confirmClaim);
router.delete('/:id', protect, authorize('donor'), cancelListing);

// Protected routes - Receiver
router.post('/:id/claim', protect, authorize('receiver'), claimLimiter, claimListing);
router.get('/my/claims', protect, authorize('receiver'), getMyClaims);
router.put('/:id/eta', protect, authorize('receiver'), updateETA);
router.post('/:id/feedback', protect, authorize('receiver'), sendFeedback);

// Protected routes - Both
router.post('/:id/complete', protect, completeListing);
router.post('/:id/rate', protect, rateListing);

module.exports = router;
