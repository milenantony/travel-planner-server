const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const suggestActivities = async (req, res) => {
  try {
    const { prompt, budget } = req.body; // We now get the budget from the frontend

    // --- NEW: Define budget context for the AI ---
    let budgetInstructions = '';
    switch (budget) {
      case 'budget':
        budgetInstructions = 'Focus on activities that are free or under ₹500 per person.';
        break;
      case 'mid-range':
        budgetInstructions = 'Focus on activities with a price range of ₹500 to ₹2500 per person.';
        break;
      case 'luxury':
        budgetInstructions = 'Focus on premium and exclusive activities, with prices above ₹2500 per person.';
        break;
      default:
        budgetInstructions = 'Provide a mix of activities for a general budget.';
    }

    // This new prompt includes the specific budget instructions
    const fullPrompt = `
      You are an expert travel planner from Kerala, India. Based on the user's request, generate a day-by-day plan.
      User's Request: "${prompt}"

      **Budget Constraint:** ${budgetInstructions}

      Respond ONLY with a valid JSON object. Do not include any other text, explanations, or markdown formatting.
      The JSON object must have a single key "itinerary" which is an array of objects.
      Each object in the array represents a single day and must have the following keys:
      - "day": (e.g., "Day 1")
      - "date": (The specific date for that day, inferred from the user's request)
      - "activities": (An array of activity objects for that day that strictly follow the budget constraint)
      
      Each activity object inside the "activities" array must have these keys: "title", "description", "price_range", and "best_time_to_visit".
      The "price_range" must align with the budget constraint provided.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();

    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("AI response was not valid JSON.");
    }
    
    const jsonString = text.substring(startIndex, endIndex + 1);
    res.status(200).json(JSON.parse(jsonString));
  } catch (error) {
    console.error("AI suggestion error:", error);
    res.status(500).json({ message: "Failed to get suggestions from AI." });
  }
};

module.exports = suggestActivities;