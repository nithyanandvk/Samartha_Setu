# Nutrition Tracker Setup Guide

## Overview
The Nutrition Tracker is an AI-powered chatbot integrated into the navbar that provides detailed nutrition information for any food item using Google's Gemini AI.

## Features
- ✨ Available in every navbar (desktop & mobile)
- 🔍 Search any food item for nutrition info
- 📊 Get calories, macros, vitamins, minerals
- 💡 Health benefits and storage tips
- 🚀 Powered by Gemini AI (free tier)

## Setup Instructions

### Step 1: Get Gemini API Key (FREE)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Add API Key to Backend

Open your backend `.env` file and add:

```env
# Gemini API (for Nutrition Tracker)
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

Replace `your-actual-gemini-api-key-here` with the API key you copied.

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

## Usage

### Desktop
1. Look for "Nutrition Tracker" button in the navbar (with ✨ Sparkles icon)
2. Click to open the chatbot modal
3. Type any food item (e.g., "Apple", "Rice", "Chicken")
4. Press Enter or click Send button
5. View detailed nutrition information

### Mobile
1. Open mobile menu (hamburger icon)
2. Tap "Nutrition Tracker"
3. Follow same steps as desktop

## API Endpoints

### Analyze Nutrition
```
POST /api/nutrition/analyze
Body: { "foodItem": "Apple" }
```

### Get Food Suggestions
```
POST /api/nutrition/suggest
Body: { "dietaryNeeds": "high protein low carb" }
```

## Features Included

1. **Nutrition Information**
   - Serving size
   - Calories
   - Protein, Carbs, Fat, Fiber
   - Vitamins & Minerals
   - Health benefits
   - Storage tips

2. **User Experience**
   - Quick search suggestions (Apple, Rice, Chicken, Broccoli)
   - Loading states with spinner
   - Beautiful gradient UI
   - Smooth animations
   - Error handling with toast notifications

3. **Accessibility**
   - Enter key support
   - Disabled states when loading
   - Click outside to close modal
   - Mobile responsive

## Troubleshooting

### "Failed to get nutrition information"
- Check if GEMINI_API_KEY is set in .env
- Verify API key is valid
- Check internet connection
- Ensure backend server is running

### "Please enter a food item"
- Make sure input field has text
- Input cannot be empty or just spaces

### API Key Issues
- Gemini API is FREE with generous limits
- If you exceed limits, create a new API key
- Check Google AI Studio for usage quotas

## Notes

- Gemini API is completely FREE for moderate usage
- No credit card required
- Rate limits are generous for typical usage
- Responses are generated in real-time
- Information is AI-generated (may not be 100% accurate for all items)

## Support

For issues or questions:
1. Check backend console logs
2. Check browser console for frontend errors
3. Verify API key is correctly set
4. Test API endpoint directly using Postman/Thunder Client
