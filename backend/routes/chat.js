const express = require('express');
const router = express.Router();
const {
  getChatByListing,
  sendMessage,
  getMyChats,
  markAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect); // All chat routes require authentication

router.get('/my', getMyChats);
router.get('/listing/:listingId', getChatByListing);
router.post('/:chatId/message', sendMessage);
router.put('/:chatId/read', markAsRead);

module.exports = router;
