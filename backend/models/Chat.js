const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isQuickReply: {
    type: Boolean,
    default: false
  },
  quickReplyType: {
    type: String,
    enum: ['on_my_way', 'thanks', 'arrived', 'delayed', 'custom'],
    default: 'custom'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema],
  lastMessage: {
    type: String,
    trim: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
chatSchema.index({ listing: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageAt: -1 });

// Update last message info
chatSchema.methods.addMessage = function(senderId, content, isQuickReply = false, quickReplyType = 'custom') {
  this.messages.push({
    sender: senderId,
    content,
    isQuickReply,
    quickReplyType,
    timestamp: new Date()
  });
  
  this.lastMessage = content;
  this.lastMessageAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Chat', chatSchema);
