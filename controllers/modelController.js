import * as openaiService from '../services/openaiService.js';
import * as anthropicService from '../services/anthropicService.js';
import * as googleAIService from '../services/googleAIService.js';


// @desc    Get available models from all providers
// @route   GET /api/models
// @access  Private
export const getModels = async (req, res, next) => {
  try {
    // Get models from all providers in parallel
    const [openaiModels, anthropicModels, googleModels] = await Promise.all([
      openaiService.getAvailableModels().catch(err => {
        console.error('OpenAI models fetch error:', err);
        return [];
      }),
      anthropicService.getAvailableModels().catch(err => {
        console.error('Anthropic models fetch error:', err);
        return [];
      }),
      googleAIService.getAvailableModels().catch(err => {
        console.error('Google AI models fetch error:', err);
        return [];
      })
    ]);

    // Map the models with their provider
    const models = {
      openai: openaiModels,
      anthropic: anthropicModels,
      google: googleModels
    };

    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available models from a specific provider
// @route   GET /api/models/:provider
// @access  Private
export const getProviderModels = async (req, res, next) => {
  try {
    const { provider } = req.params;
    let models = [];

    switch (provider) {
      case 'openai':
        models = await openaiService.getAvailableModels();
        break;
      case 'anthropic':
        models = await anthropicService.getAvailableModels();
        break;
      case 'google':
        models = await googleAIService.getAvailableModels();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid provider'
        });
    }

    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    next(error);
  }
};