import axios from 'axios';

/**
 * Generate a response from OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} modelName - OpenAI model name (e.g., 'gpt-4', 'gpt-3.5-turbo')
 * @returns {Promise<String>} - The AI-generated response
 */
export const generateResponse = async (messages, modelName) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate response from OpenAI');
  }
};

/**
 * Get available models from OpenAI
 * @returns {Promise<Array>} - Array of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await axios.get(
      'https://api.openai.com/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // Filter for only chat models (GPT-3.5, GPT-4)
    const chatModels = response.data.data.filter(model => 
      model.id.includes('gpt-3.5') || 
      model.id.includes('gpt-4')
    );

    return chatModels.map(model => ({
      id: model.id,
      name: model.id
    }));
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch OpenAI models');
  }
};