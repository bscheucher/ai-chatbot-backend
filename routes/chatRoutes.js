import express from 'express'
import{
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation 
} from '../controllers/chatController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Message routes
router.post('/message', sendMessage);

// Conversation routes
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);

export default router;