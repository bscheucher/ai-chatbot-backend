import Conversation from '../models/Conversation.js';
// Change from default imports to named imports
import * as openaiService from '../services/openaiService.js';
import * as anthropicService from '../services/anthropicService.js';
import * as googleAIService from '../services/googleAIService.js';

// @desc    Send a message to AI model
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message, modelProvider, modelName } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    let conversation;
    
    // If conversationId is provided, find the existing conversation
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user.id
      });
      
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }
    } else {
      // Create a new conversation if no conversationId was provided
      if (!modelProvider || !modelName) {
        return res.status(400).json({
          success: false,
          message: 'Please provide model provider and model name for new conversation'
        });
      }
      
      conversation = await Conversation.create({
        user: req.user.id,
        title: 'New Conversation',
        modelProvider,
        modelName,
        messages: []
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Get AI response based on model provider
    let aiResponse;
    const messageHistory = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    switch (conversation.modelProvider) {
      case 'openai':
        aiResponse = await openaiService.generateResponse(messageHistory, conversation.modelName);
        break;
      case 'anthropic':
        aiResponse = await anthropicService.generateResponse(messageHistory, conversation.modelName);
        break;
      case 'google':
        aiResponse = await googleAIService.generateResponse(messageHistory, conversation.modelName);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid model provider'
        });
    }

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    // Update the conversation title if this is the first message
    if (conversation.messages.length === 2) {
      // Generate a title based on the first message (up to 30 chars)
      conversation.title = message.length > 30 
        ? `${message.substring(0, 27)}...` 
        : message;
    }

    // Save the updated conversation
    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        conversation,
        message: {
          role: 'assistant',
          content: aiResponse
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ updatedAt: -1 }) // Sort by most recent
      .select('title modelProvider modelName createdAt updatedAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single conversation
// @route   GET /api/chat/conversations/:id
// @access  Private
export const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a conversation
// @route   DELETE /api/chat/conversations/:id
// @access  Private
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Updated: conversation.remove() is deprecated in newer Mongoose versions
    await Conversation.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};