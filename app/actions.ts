'use server';

import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, MassageMode, HeatLevel } from "../types";

// Initialize Server-Side
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartRecommendation(userFeeling: string): Promise<AIRecommendation> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user feels: "${userFeeling}". Recommend settings for a pillow massager.`,
      config: {
        systemInstruction: `You are an expert relaxation therapist controlling a smart pillow massager called "PillowEase". 
        Based on the user's description of their physical state or mood, recommend the optimal settings.
        
        Available Modes:
        - KNEADING: Deep tissue, good for knots.
        - SHIATSU: Targeted pressure points.
        - PULSE: Rhythmic, good for circulation.
        - WAVE: Gentle, rolling, good for sleepiness.
        - AI_ADAPTIVE: Complex varying pattern (use for general stress).

        Intensity: 1-100.
        Heat: OFF, LOW, HIGH.
        Duration: 5-60 minutes.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mode: {
              type: Type.STRING,
              enum: ["KNEADING", "SHIATSU", "PULSE", "WAVE", "AI_ADAPTIVE"]
            },
            intensity: { type: Type.INTEGER },
            heat: { type: Type.STRING, enum: ["OFF", "LOW", "HIGH"] },
            duration: { type: Type.INTEGER },
            reasoning: { type: Type.STRING }
          },
          required: ["mode", "intensity", "heat", "duration", "reasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIRecommendation;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback
    return {
      mode: MassageMode.KNEADING,
      intensity: 50,
      heat: HeatLevel.LOW,
      duration: 15,
      reasoning: "We couldn't reach the AI brain, so we selected a balanced default for you."
    };
  }
}