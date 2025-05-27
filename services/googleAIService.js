import axios from 'axios';

/**
 * Generate a response from Google AI API (PaLM/Gemini)
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} modelName - Google model name (e.g., 'gemini-pro')
 * @returns {Promise<String>} - The AI-generated response
 */
export const generateResponse = async (messages, modelName) => {
  try {
    // Format messages for Google AI API
    // For gemini models
    if (modelName.includes('gemini')) {
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
        {
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        },
        {
          params: {
            key: process.env.GOOGLE_AI_API_KEY
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } 
    // For PaLM models (if still in use)
    else {
      // Construct a prompt from the messages
      const prompt = messages.map(msg => 
        `${msg.role === 'assistant' ? 'AI' : 'Human'}: ${msg.content}`
      ).join('\n') + '\nAI: ';
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta2/models/${modelName}:generateText`,
        {
          prompt: { text: prompt },
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
        {
          params: {
            key: process.env.GOOGLE_AI_API_KEY
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].output;
    }
  } catch (error) {
    console.error('Google AI API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate response from Google AI');
  }
};

/**
 * Get available models from Google AI
 * @returns {Promise<Array>} - Array of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        params: {
          key: process.env.GOOGLE_AI_API_KEY
        }
      }
    );

    // Filter for text generation models
    const textModels = response.data.models.filter(model => 
      model.supportedGenerationMethods.includes('generateContent') ||
      model.supportedGenerationMethods.includes('generateText')
    );

    return textModels.map(model => ({
      id: model.name.split('/').pop(),
      name: model.displayName || model.name
    }));
  } catch (error) {
    console.error('Google AI API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch Google AI models');
  }
};