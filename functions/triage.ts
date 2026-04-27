import { TriageResult } from './sentinel';
import { useCrisisStore, Hazard } from '../store/useCrisisStore';

/**
 * MISSION: SentinelMesh Triage Orchestrator
 * GOAL: UN SDG 11.5 - Enhancing disaster resilience through data accuracy.
 * Logic: Validates and sanitizes AI-generated hazard data.
 */

/**
 * Processes the raw result from the AI and prepares it for the global store.
 * This ensures no malformed data enters the system.
 */
export const executeTriage = (rawResult: TriageResult): Omit<Hazard, "id" | "timestamp"> => {
  // 1. Validation Logic
  const validTypes = ["fire", "flood", "medical", "structural", "unknown"];
  const validSeverities = ["low", "medium", "high", "critical"];

  // 2. Data Sanitization
  const finalizedType = validTypes.includes(rawResult.type) 
    ? (rawResult.type as Hazard['type']) 
    : "unknown";

  const finalizedSeverity = validSeverities.includes(rawResult.severity) 
    ? (rawResult.severity as Hazard['severity']) 
    : "medium";

  // 3. Constructing the Hazard Object for the Store
  return {
    type: finalizedType,
    severity: finalizedSeverity,
    description: rawResult.summary || "No description provided by Sentinel AI.",
    status: "active",
    location: {
      latitude: 0, // Should be updated with real GPS data before calling
      longitude: 0,
    }
  };
};

/**
 * Helper to determine urgency level for UI notifications
 */
export const getUrgencyColor = (severity: Hazard['severity']): string => {
  switch (severity) {
    case 'critical': return '#FF0000'; // Pure Red
    case 'high':     return '#FF4500'; // OrangeRed
    case 'medium':   return '#FFA500'; // Orange
    case 'low':      return '#FFFF00'; // Yellow
    default:         return '#808080'; // Gray
  }
};