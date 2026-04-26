import { analyzeSituation } from '../services/vertex';
import { db } from '../services/firebase';

/**
 * MISSION: SentinelMesh AI Triage Logic
 * LOCATION: src/functions/sentinel.ts
 * GOAL: UN SDG 11.5 - Autonomous Hazard Detection
 */

export interface TriageResult {
  type: 'fire' | 'flood' | 'medical' | 'structural' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  actionRequired: string;
}

/**
 * Core Function: Orchestrates AI analysis and Database persistence
 */
export const processSentinelVision = async (base64Image: string, location: { latitude: number, longitude: number }) => {
  try {
    const prompt = `
      Analyze this disaster scene. Return a JSON object with:
      {
        "type": "fire" | "flood" | "medical" | "structural" | "unknown",
        "severity": "low" | "medium" | "high" | "critical",
        "summary": "10 word description",
        "actionRequired": "Immediate next step"
      }
      ONLY return the JSON.
    `;

    // 1. Call the AI Service
    const aiResponse = await analyzeSituation(prompt, base64Image);
    
    // 2. Clean and Parse the JSON
    const cleanedJson = aiResponse.replace(/```json|```/g, "").trim();
    const parsedData: TriageResult = JSON.parse(cleanedJson);

    // 3. Save to Global State/Database (Persistence enabled)
    await db.collection('hazards').add({
      ...parsedData,
      location,
      timestamp: Date.now(),
      status: 'active'
    });

    return parsedData;
  } catch (error) {
    console.error("Sentinel Logic Error:", error);
    return null;
  }
};