import axios from 'axios';

/**
 * Generate a response from Anthropic API
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} modelName - Anthropic model name (e.g., 'claude-3-opus-20240229')
 * @returns {Promise<String>} - The AI-generated response
 */
export const generateResponse = async (messages, modelName) => {
  try {
    // Convert to Anthropic message format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: modelName,
        messages: formattedMessages,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Anthropic API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate response from Anthropic');
  }
};

/**
 * Get available models from Anthropic
 * @returns {Promise<Array>} - Array of available models
 */
export const getAvailableModels = async () => {
  // Currently Anthropic doesn't have a models endpoint
  // Return the list of known models
  return [
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    { id: 'claude-2.1', name: 'Claude 2.1' },
    { id: 'claude-2.0', name: 'Claude 2.0' },
    { id: 'claude-instant-1.2', name: 'Claude Instant 1.2' }
  ];
};