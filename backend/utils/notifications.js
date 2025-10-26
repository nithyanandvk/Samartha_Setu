const Notification = require('../models/Notification');

/**
 * Create and emit a notification
 * @param {Object} io - Socket.IO instance
 * @param {Object} data - Notification data
 */
exports.createNotification = async (io, data) => {
  try {
    const notification = await Notification.create(data);
    
    // Populate sender if exists
    if (notification.sender) {
      await notification.populate('sender', 'name email role');
    }
    
    // Emit to recipient via Socket.IO
    if (io) {
      io.to(notification.recipient.toString()).emit('notification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Notification templates
 */
exports.notificationTemplates = {
  listingClaimed: (receiverName, listingTitle) => ({
    type: 'listing_claimed',
    title: 'Listing Claimed!',
    message: `${receiverName} has claimed your listing "${listingTitle}". Please confirm or reject the claim.`,
    priority: 'high'
  }),
  
  claimConfirmed: (receiverName, listingTitle) => ({
    type: 'claim_confirmed',
    title: 'Claim Confirmed!',
    message: `Your claim for "${listingTitle}" has been confirmed by ${receiverName}. You can now proceed with pickup.`,
    priority: 'high'
  }),
  
  claimRejected: (listingTitle) => ({
    type: 'claim_rejected',
    title: 'Claim Rejected',
    message: `Your claim for "${listingTitle}" was not accepted. The listing is available for others.`,
    priority: 'medium'
  }),
  
  listingCompleted: (listingTitle, points) => ({
    type: 'listing_completed',
    title: 'Donation Completed!',
    message: `Your donation "${listingTitle}" has been completed. You earned ${points} points!`,
    priority: 'medium'
  }),
  
  listingExpired: (listingTitle) => ({
    type: 'listing_expired',
    title: 'Listing Expired',
    message: `Your listing "${listingTitle}" has expired and is no longer available.`,
    priority: 'low'
  }),
  
  newMessage: (senderName, listingTitle) => ({
    type: 'new_message',
    title: 'New Message',
    message: `${senderName} sent you a message about "${listingTitle}"`,
    priority: 'medium'
  }),
  
  accountVerified: () => ({
    type: 'account_verified',
    title: 'Account Verified!',
    message: 'Your organization account has been verified. You can now create bulk listings.',
    priority: 'high'
  }),
  
  accountBanned: (reason) => ({
    type: 'account_banned',
    title: 'Account Suspended',
    message: `Your account has been suspended. Reason: ${reason}`,
    priority: 'urgent'
  }),
  
  rewardEarned: (rewardName) => ({
    type: 'reward_earned',
    title: 'Reward Unlocked!',
    message: `Congratulations! You've unlocked the "${rewardName}" reward.`,
    priority: 'high'
  }),
  
  badgeEarned: (badgeName) => ({
    type: 'badge_earned',
    title: 'New Badge!',
    message: `You've earned the "${badgeName}" badge! Keep up the great work.`,
    priority: 'medium'
  }),
  
  fallbackTriggered: (listingTitle, fallbackType) => ({
    type: 'fallback_triggered',
    title: 'Fallback Activated',
    message: `Your listing "${listingTitle}" has been routed to ${fallbackType} due to no claims.`,
    priority: 'medium'
  }),
  
  ratingReceived: (rating, listingTitle) => ({
    type: 'rating_received',
    title: 'New Rating',
    message: `You received a ${rating}-star rating for "${listingTitle}"`,
    priority: 'low'
  }),
  
  receivedRating: (rating) => ({
    type: 'rating_received',
    title: rating >= 4 ? 'Great Rating!' : 'New Rating',
    message: `You received a ${rating}-star rating. ${rating >= 4 ? 'Keep up the excellent work!' : 'Thank you for your contribution.'}`,
    priority: rating >= 4 ? 'medium' : 'low'
  })
};
