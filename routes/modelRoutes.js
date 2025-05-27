import express from'express';
import {
  getModels,
  getProviderModels
} from '../controllers/modelController.js';
import protect from'../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all models from all providers
router.get('/', getModels);

// Get models from a specific provider
router.get('/:provider', getProviderModels);

export default router;