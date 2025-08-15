const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateFullItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget } = req.body;
    const fullPrompt = `
      You are an expert travel planner from Thrikkodithanam, Kerala. A user wants a travel plan for a trip to "${destination}" from "${startDate}" to "${endDate}" on a "${budget}" budget.
      Respond ONLY with a valid JSON object. Do not include any other text or markdown.
      The JSON object must have a single key "itinerary" which is an array of objects.
      Each object in the array represents a day and must have the keys: "day", "date", "theme", "morning", "afternoon", and "evening".
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');

    // This line is also corrected for safety.
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("AI response was not valid JSON.");
    }
    
    const jsonString = text.substring(startIndex, endIndex + 1);
    res.status(200).json(JSON.parse(jsonString));
  } catch (error) {
    console.error("AI itinerary generation error:", error);
    res.status(500).json({ message: "Failed to generate itinerary from AI." });
  }
};

module.exports = generateFullItinerary;