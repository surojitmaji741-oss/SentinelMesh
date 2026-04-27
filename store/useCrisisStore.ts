import { create } from "zustand";

/**
 * MISSION: SentinelMesh Global State Management
 * GOAL: UN SDG 11.5 - Real-time disaster data synchronization
 */

// 1. Define the shape of a Hazard for strict TypeScript safety
export interface Hazard {
  id: string;
  type: "fire" | "flood" | "medical" | "structural" | "unknown";
  severity: "low" | "medium" | "high" | "critical";
  location: {
    latitude: number;
    longitude: number;
    roomNumber?: string; // For indoor mapping
  };
  description: string;
  timestamp: number;
  status: "active" | "resolved" | "investigating";
}

interface CrisisState {
  // Data State
  hazards: Hazard[];
  isScanning: boolean;
  activeMeshNodes: number;

  // Actions
  addHazard: (hazard: Omit<Hazard, "id" | "timestamp">) => void;
  resolveHazard: (id: string) => void;
  setScanning: (status: boolean) => void;
  updateMeshCount: (count: number) => void;
  clearAll: () => void;
}

export const useCrisisStore = create<CrisisState>((set) => ({
  // Initial State
  hazards: [],
  isScanning: false,
  activeMeshNodes: 0,

  /**
   * Adds a new hazard detected by Gemini Vision or Mesh Sync
   */
  addHazard: (newHazard) =>
    set((state) => ({
      hazards: [
        {
          ...newHazard,
          id: Math.random().toString(36).substring(7), // Unique ID generation
          timestamp: Date.now(),
          status: "active",
        },
        ...state.hazards,
      ],
    })),

  /**
   * Updates a hazard status when a responder clears the area
   */
  resolveHazard: (id) =>
    set((state) => ({
      hazards: state.hazards.map((h) =>
        h.id === id ? { ...h, status: "resolved" } : h,
      ),
    })),

  setScanning: (status) => set({ isScanning: status }),

  updateMeshCount: (count) => set({ activeMeshNodes: count }),

  clearAll: () => set({ hazards: [], activeMeshNodes: 0 }),
}));
