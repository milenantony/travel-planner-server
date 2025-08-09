// server/controllers/aiController.js

// Import the Google AI toolkit
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the AI model with our secret API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is our main function that will generate suggestions
exports.suggestActivities = async (req, res) => {
  try {
    // Get the user's travel prompt from the request body
    const { prompt } = req.body;

    // This is the crucial part: The "System Prompt"
    // We give the AI very specific instructions on how to behave and what format to respond in.
    const fullPrompt = `
      You are an expert travel planner from Kerala, specializing in creating exciting itineraries.
      Based on the user's request, generate a list of 3 to 5 suggested activities.

      User's Request: "${prompt}"

      Respond ONLY with a valid JSON object. Do not include any other text or explanations.
      The JSON object should have a single key "suggestions" which is an array of objects.
      Each object in the array should have the following keys: "title", "description", "estimated_cost", and "best_time_to_visit".
    `;

    // This is the new, corrected line
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Send the full prompt to the AI and wait for the result
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    // This is the new, robust code
    const text = response.text();

    // Clean the text from the AI to make sure it's valid JSON
    // This finds the first '{' and the last '}' and extracts everything in between.
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    const jsonString = text.substring(startIndex, endIndex + 1);

    // Now, parse the cleaned string
    const jsonResponse = JSON.parse(jsonString);

    // Send the structured JSON suggestions back to the user
    res.status(200).json(jsonResponse);

  } catch (error) {
    console.error("AI suggestion error:", error);
    res.status(500).json({ msg: "Failed to get suggestions from AI" });
  }
};