import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database.js';
// Import routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
// Error handler middleware
import errorHandler from './middleware/errorHandler.js';

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Connect to database
try {
  await connectDB();
} catch (err) {
  console.error('DB init failed:', err.message);
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logger

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/models', modelRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});