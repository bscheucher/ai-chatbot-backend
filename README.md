# AI Chatbot Backend

A Node.js Express backend for an AI chatbot application that integrates with OpenAI, Anthropic, and Google AI models.

## Features

- User authentication (register, login)
- Chat with multiple AI models (OpenAI, Anthropic, Google)
- Conversation history storage and retrieval
- User preferences management

## Prerequisites

- Node.js (v14+)
- MongoDB
- API keys for OpenAI, Anthropic, and Google AI

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-chatbot-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-chatbot
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

4. Start the development server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

### Chat
- `POST /api/chat/message` - Send a message to an AI model
- `GET /api/chat/conversations` - Get all conversations for a user
- `GET /api/chat/conversations/:id` - Get a single conversation
- `DELETE /api/chat/conversations/:id` - Delete a conversation

### Models
- `GET /api/models` - Get available models from all providers
- `GET /api/models/:provider` - Get available models from a specific provider

## Request Examples

### Register a User
```
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Send a Message
```
POST /api/chat/message
{
  "conversationId": "60f1b5b5e6c2a41e8c2a1234", // Optional, omit for new conversation
  "message": "Hello, how are you?",
  "modelProvider": "openai", // Required for new conversation
  "modelName": "gpt-4" // Required for new conversation
}
```

## License

MIT