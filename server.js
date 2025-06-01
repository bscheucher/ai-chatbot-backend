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

// Load environment variables first
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
try {
  await connectDB();
  console.log('✅ Database connected successfully');
} catch (err) {
  console.error('❌ DB connection failed:', err.message);
  process.exit(1);
}

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'https://ai-chatbot-frontend-y33f.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false // Allow embedding for CORS
}));
app.use(cors(corsOptions)); // Configured CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Conditional logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Chatbot API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cors: 'configured'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/models', modelRoutes);

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});