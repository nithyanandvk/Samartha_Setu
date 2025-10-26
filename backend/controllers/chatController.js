const Chat = require('../models/Chat');
const Listing = require('../models/Listing');
const { createNotification, notificationTemplates } = require('../utils/notifications');

// @desc    Get chat for a listing
// @route   GET /api/chat/listing/:listingId
// @access  Private
exports.getChatByListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is participant (donor or claimer)
    const isParticipant = listing.donor.toString() === req.user.id || 
                         (listing.claimedBy && listing.claimedBy.toString() === req.user.id);
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    let chat = await Chat.findOne({ listing: req.params.listingId })
      .populate('participants', 'name email role subtype')
      .populate('messages.sender', 'name role');

    // Create chat if doesn't exist
    if (!chat && listing.claimedBy) {
      chat = await Chat.create({
        listing: listing._id,
        participants: [listing.donor, listing.claimedBy],
        messages: []
      });
      
      await chat.populate('participants', 'name email role subtype');
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat'
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/:chatId/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content, isQuickReply, quickReplyType } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name')
      .populate('listing', 'title donor claimedBy');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Add message
    await chat.addMessage(
      req.user.id,
      content,
      isQuickReply || false,
      quickReplyType || 'custom'
    );

    // Reload with populated data
    await chat.populate('messages.sender', 'name role');

    // Get recipient (the other participant)
    const recipient = chat.participants.find(
      p => p._id.toString() !== req.user.id
    );

    // Send notification
    if (recipient) {
      const notifData = {
        recipient: recipient._id,
        sender: req.user.id,
        relatedListing: chat.listing._id,
        ...notificationTemplates.newMessage(req.user.name, chat.listing.title)
      };
      
      await createNotification(req.io, notifData);
    }

    // Emit real-time message
    if (req.io) {
      req.io.to(chat._id.toString()).emit('new_message', {
        chatId: chat._id,
        message: chat.messages[chat.messages.length - 1]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent',
      chat
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Get user's chats
// @route   GET /api/chat/my
// @access  Private
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true
    })
      .populate('participants', 'name email role subtype')
      .populate('listing', 'title status foodType')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chats'
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:chatId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all messages as read by current user
    chat.messages.forEach(msg => {
      const alreadyRead = msg.readBy.some(
        r => r.user.toString() === req.user.id
      );
      
      if (!alreadyRead && msg.sender.toString() !== req.user.id) {
        msg.readBy.push({
          user: req.user.id,
          readAt: new Date()
        });
      }
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read'
    });
  }
};
