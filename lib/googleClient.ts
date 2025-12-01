import { GoogleGenerativeAI } from "@google/generative-ai";

// Use process.env.API_KEY as mandated.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Missing API_KEY. AI features will run in mock mode or fail.");
}

// Initialize the client
export const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");

/**
 * Helper to ask Gemini a simple text prompt.
 * Uses 'gemini-2.5-flash' by default for speed and cost efficiency.
 */
export async function askGemini(prompt: string, modelName: string = "gemini-2.5-flash"): Promise<string> {
  if (!API_KEY) return "";
  
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "";
  }
}