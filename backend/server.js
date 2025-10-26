require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');

const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const nutritionRoutes = require('./routes/nutrition');

// Import models for automation
const Listing = require('./models/Listing');
const Checkpoint = require('./models/Checkpoint');
const { createNotification, notificationTemplates } = require('./utils/notifications');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', apiLimiter);

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's personal room for notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Join chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Leave chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat: ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// TTL and Fallback Automation
// Run every minute to check for expired listings and trigger fallbacks
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    
    // Find expired listings
    const expiredListings = await Listing.find({
      status: 'available',
      expiresAt: { $lte: now },
      isExpired: false
    }).populate('donor', 'name');

    for (const listing of expiredListings) {
      listing.status = 'expired';
      listing.isExpired = true;
      await listing.save();

      // Notify donor
      const notifData = {
        recipient: listing.donor._id,
        relatedListing: listing._id,
        ...notificationTemplates.listingExpired(listing.title)
      };
      
      await createNotification(io, notifData);

      console.log(`Listing ${listing._id} expired`);
    }

    // Check for fallback triggers
    const fallbackDelay = parseInt(process.env.FALLBACK_DELAY_MINUTES) || 30;
    const fallbackTime = new Date(now.getTime() - fallbackDelay * 60 * 1000);

    const fallbackListings = await Listing.find({
      status: 'available',
      createdAt: { $lte: fallbackTime },
      fallbackTriggered: false,
      fallbackPreference: { $ne: 'none' }
    }).populate('donor', 'name');

    for (const listing of fallbackListings) {
      // Find nearest checkpoint based on fallback order
      let targetCheckpoint = null;
      
      for (const fallbackType of listing.fallbackOrder) {
        const checkpoints = await Checkpoint.find({
          type: fallbackType === 'receiver' ? 'fridge' : fallbackType,
          isActive: true,
          location: {
            $near: {
              $geometry: listing.location,
              $maxDistance: 50000 // 50km radius
            }
          }
        }).limit(1);

        if (checkpoints.length > 0) {
          targetCheckpoint = checkpoints[0];
          break;
        }
      }

      if (targetCheckpoint) {
        listing.fallbackTriggered = true;
        listing.fallbackAt = new Date();
        listing.status = 'confirmed'; // Auto-confirm for checkpoint
        await listing.save();

        // Update checkpoint stats
        targetCheckpoint.totalReceived += 1;
        targetCheckpoint.totalKgReceived += listing.estimatedKg;
        await targetCheckpoint.save();

        // Notify donor
        const notifData = {
          recipient: listing.donor._id,
          relatedListing: listing._id,
          ...notificationTemplates.fallbackTriggered(
            listing.title,
            targetCheckpoint.name
          )
        };
        
        await createNotification(io, notifData);

        console.log(`Fallback triggered for listing ${listing._id} to ${targetCheckpoint.name}`);
      }
    }
  } catch (error) {
    console.error('TTL/Fallback automation error:', error);
  }
});

// Auto-ban users with low ratings
cron.schedule('0 0 * * *', async () => {
  try {
    const User = require('./models/User');
    
    const lowRatedUsers = await User.find({
      role: 'donor',
      averageRating: { $lt: 2 },
      ratingsCount: { $gte: 5 }, // At least 5 ratings
      isBanned: false
    });

    for (const user of lowRatedUsers) {
      user.isBanned = true;
      user.banReason = 'Consistently low ratings from receivers';
      user.bannedAt = new Date();
      await user.save();

      const notifData = {
        recipient: user._id,
        ...notificationTemplates.accountBanned(user.banReason)
      };
      
      await createNotification(io, notifData);

      console.log(`Auto-banned user ${user._id} for low ratings`);
    }
  } catch (error) {
    console.error('Auto-ban automation error:', error);
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.IO ready for real-time connections`);
      console.log(`⏰ TTL and fallback automation active`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.error('💡 Make sure MONGODB_URI is set in .env file');
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
