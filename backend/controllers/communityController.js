const Community = require('../models/Community');
const User = require('../models/User');
const { createNotification } = require('../utils/notifications');

// @desc    Get community by ID
// @route   GET /api/community/:id
// @access  Private
exports.getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('donor', 'name email organizationName subtype location phone')
      .populate('receiver', 'name email subtype phone')
      .populate('listing', 'title foodType quantity location')
      .populate('messages.sender', 'name role')
      .populate('timeline.completedBy', 'name');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is participant (donor or receiver)
    const isParticipant = community.donor._id.toString() === req.user.id || 
                         community.receiver._id.toString() === req.user.id;
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this community'
      });
    }

    res.status(200).json({
      success: true,
      community
    });
  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching community'
    });
  }
};

// @desc    Get user's communities
// @route   GET /api/community/my/communities
// @access  Private
exports.getMyCommunities = async (req, res) => {
  try {
    const query = {
      $or: [
        { donor: req.user.id },
        { receiver: req.user.id }
      ],
      isActive: true
    };

    const communities = await Community.find(query)
      .populate('donor', 'name organizationName')
      .populate('receiver', 'name')
      .populate('listing', 'title foodType')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: communities.length,
      communities
    });
  } catch (error) {
    console.error('Get my communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching communities'
    });
  }
};

// @desc    Send message in community
// @route   POST /api/community/:id/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const community = await Community.findById(req.params.id)
      .populate('donor', 'name')
      .populate('receiver', 'name');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is participant
    const isParticipant = community.donor._id.toString() === req.user.id || 
                         community.receiver._id.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Add message
    await community.addMessage(req.user.id, content.trim());

    // Reload with populated data
    await community.populate('messages.sender', 'name role');

    // Get recipient (the other participant)
    const recipientId = community.donor._id.toString() === req.user.id 
      ? community.receiver._id 
      : community.donor._id;

    // Send notification to recipient
    const notifData = {
      recipient: recipientId,
      sender: req.user.id,
      type: 'community_message',
      title: '💬 New Community Message',
      message: `${req.user.name} sent you a message in ${community.title}`,
      link: `/community/${community._id}`
    };
    
    await createNotification(req.io, notifData);

    // Emit real-time message
    if (req.io) {
      req.io.to(community._id.toString()).emit('community_message', {
        communityId: community._id,
        message: community.messages[community.messages.length - 1]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent',
      community
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Update timeline event
// @route   PUT /api/community/:id/timeline/:eventIndex
// @access  Private
exports.updateTimelineEvent = async (req, res) => {
  try {
    const { eventIndex } = req.params;
    const { isCompleted, description } = req.body;

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is participant
    const isParticipant = community.donor.toString() === req.user.id || 
                         community.receiver.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const index = parseInt(eventIndex);
    if (index < 0 || index >= community.timeline.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event index'
      });
    }

    const event = community.timeline[index];
    
    if (isCompleted !== undefined) {
      event.isCompleted = isCompleted;
      event.completedBy = req.user.id;
      event.completedAt = new Date();
      
      // Update bike position based on event completion
      if (event.type === 'food_sent' && isCompleted) {
        community.bikePosition = 0;
      } else if (event.type === 'in_transit' && isCompleted) {
        community.bikePosition = 50;
      } else if (event.type === 'received' && isCompleted) {
        community.bikePosition = 100;
        community.actualDeliveryTime = new Date();
        community.isActive = false;
      }
      
      community.currentStatus = event.type;
    }

    if (description) {
      event.description = description;
    }

    await community.save();
    await community.populate('timeline.completedBy', 'name');

    // Emit real-time update
    if (req.io) {
      req.io.to(community._id.toString()).emit('timeline_updated', {
        communityId: community._id,
        timeline: community.timeline,
        bikePosition: community.bikePosition,
        currentStatus: community.currentStatus
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timeline updated',
      community
    });
  } catch (error) {
    console.error('Update timeline error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating timeline'
    });
  }
};

// @desc    Update bike position
// @route   PUT /api/community/:id/bike-position
// @access  Private (Receiver only)
exports.updateBikePosition = async (req, res) => {
  try {
    const { position } = req.body;

    if (position === undefined || position < 0 || position > 100) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 0 and 100'
      });
    }

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Only receiver can update bike position
    if (community.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only receiver can update bike position'
      });
    }

    await community.updateBikePosition(position);

    // Emit real-time update
    if (req.io) {
      req.io.to(community._id.toString()).emit('bike_position_updated', {
        communityId: community._id,
        bikePosition: community.bikePosition,
        currentStatus: community.currentStatus
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bike position updated',
      bikePosition: community.bikePosition,
      currentStatus: community.currentStatus
    });
  } catch (error) {
    console.error('Update bike position error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bike position'
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/community/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is participant
    const isParticipant = community.donor.toString() === req.user.id || 
                         community.receiver.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Mark all messages as read by current user
    community.messages.forEach(msg => {
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

    await community.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read'
    });
  }
};

// @desc    Add custom timeline event
// @route   POST /api/community/:id/timeline
// @access  Private
exports.addTimelineEvent = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Event title is required'
      });
    }

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is participant
    const isParticipant = community.donor.toString() === req.user.id || 
                         community.receiver.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const eventData = {
      type: 'custom',
      title,
      description,
      location,
      completedBy: req.user.id,
      isCompleted: true,
      completedAt: new Date()
    };

    await community.addTimelineEvent(eventData);
    await community.populate('timeline.completedBy', 'name');

    // Emit real-time update
    if (req.io) {
      req.io.to(community._id.toString()).emit('timeline_updated', {
        communityId: community._id,
        timeline: community.timeline,
        bikePosition: community.bikePosition
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timeline event added',
      community
    });
  } catch (error) {
    console.error('Add timeline event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding timeline event'
    });
  }
};
