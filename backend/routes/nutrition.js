const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/nutrition/analyze
// @desc    Get nutrition information for a food item
// @access  Public
router.post('/analyze', async (req, res) => {
  try {
    const { foodItem } = req.body;

    if (!foodItem || foodItem.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a food item'
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create a detailed prompt for nutrition information
    const prompt = `Provide nutrition information for "${foodItem}" per 100g serving in this exact format:

🍽️ SERVING SIZE
• Standard serving: [amount]

📊 CALORIES
• Total: [amount] kcal

🥩 MACRONUTRIENTS
• Protein: [amount]g
• Carbohydrates: [amount]g
• Fat: [amount]g
• Fiber: [amount]g
• Sugar: [amount]g

💎 MICRONUTRIENTS
• Vitamin A: [amount]
• Vitamin C: [amount]
• Calcium: [amount]
• Iron: [amount]
• [other key vitamins/minerals]

Keep it concise and only include nutritional values. If the food item is unclear, provide information for the most common variant.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const nutritionInfo = response.text();

    res.json({
      success: true,
      foodItem,
      nutritionInfo
    });

  } catch (error) {
    console.error('Nutrition API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nutrition information',
      error: error.message
    });
  }
});

// @route   POST /api/nutrition/suggest
// @desc    Get food suggestions based on dietary needs
// @access  Public
router.post('/suggest', async (req, res) => {
  try {
    const { dietaryNeeds } = req.body;

    if (!dietaryNeeds || dietaryNeeds.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide dietary needs or preferences'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Based on the following dietary needs or preferences: "${dietaryNeeds}", suggest 5 healthy food options with brief nutritional highlights for each. Format the response as a numbered list.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Nutrition Suggest API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get food suggestions',
      error: error.message
    });
  }
});

module.exports = router;
