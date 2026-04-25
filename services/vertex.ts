import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * MISSION: SentinelMesh AI Vision System
 * GOAL: UN SDG 11.5 - Enhancing disaster response via AI Triage
 * * ⚠️ SECURITY NOTE: API Key is stored in .env for prototype phase.
 * In production, move this to a secure Backend Cloud Function.
 */
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Analyzes disaster scenes using Gemini 1.5 Flash.
 * Flash is utilized here for its superior speed-to-latency ratio,
 * which is critical for real-time emergency triage.
 */
export const analyzeSituation = async (
  prompt: string,
  base64Image?: string,
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Optional: Add safety settings to ensure AI doesn't refuse to analyze "scary" disaster scenes
    });

    if (base64Image) {
      // Multimodal Analysis: Processing Vision + Contextual Prompt
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg",
          },
        },
      ]);

      const response = await result.response;
      return response.text();
    } else {
      // Text-only Analysis: Triage Chat / Text Summarization
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    // Detailed logging helps during the live demo if network issues occur
    console.error("Gemini AI Engine Error:", error);
    return "Analysis offline. Please check mesh connectivity.";
  }
};
