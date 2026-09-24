
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const prompt = `
You are a specialized medical imaging AI assistant. Your task is to analyze chest X-ray images.
Based on the provided image, you must:
1.  Identify potential medical conditions.
2.  Provide a list of up to 5 possible diagnoses with their estimated probabilities (as a number between 0 and 1). The sum of probabilities does not need to be 1.
3.  For each diagnosis, provide a brief, one-sentence description of the condition.
4.  Generate a plausible summary of your findings.
5.  Identify the most significant area of interest in the image that led to your primary diagnosis. Provide coordinates (x, y) and a radius for an "attention hotspot". The coordinates and radius must be normalized between 0 and 1. 'x' represents the horizontal position (0=left, 1=right), 'y' the vertical position (0=top, 1=bottom), and 'radius' as a percentage of the image's smallest dimension.

You must respond ONLY with a valid JSON object that conforms to the provided schema. Do not include any markdown formatting or explanatory text outside of the JSON structure.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    diagnoses: {
      type: Type.ARRAY,
      description: "A list of possible diagnoses, their probabilities, and descriptions.",
      items: {
        type: Type.OBJECT,
        properties: {
          condition: {
            type: Type.STRING,
            description: "The name of the potential medical condition.",
          },
          probability: {
            type: Type.NUMBER,
            description: "The estimated probability of the condition, from 0 to 1.",
          },
          description: {
            type: Type.STRING,
            description: "A brief, one-sentence description of the medical condition."
          }
        },
        required: ["condition", "probability", "description"],
      },
    },
    attentionHotspot: {
      type: Type.OBJECT,
      description: "Coordinates and size of the primary area of interest.",
      properties: {
        x: {
          type: Type.NUMBER,
          description: "Normalized horizontal coordinate (0-1) of the hotspot center.",
        },
        y: {
          type: Type.NUMBER,
          description: "Normalized vertical coordinate (0-1) of the hotspot center.",
        },
        radius: {
          type: Type.NUMBER,
          description: "Normalized radius of the hotspot (0-1).",
        },
      },
      required: ["x", "y", "radius"],
    },
    summary: {
      type: Type.STRING,
      description: "A brief, professional summary of the findings."
    }
  },
  required: ["diagnoses", "attentionHotspot", "summary"],
};


export const analyzeXRayImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    // Basic validation
    if (!parsedResult.diagnoses || !parsedResult.attentionHotspot || !parsedResult.summary) {
        throw new Error("Invalid response structure from API.");
    }
    
    parsedResult.diagnoses.forEach((d: any) => {
        if (typeof d.description !== 'string') {
            throw new Error("Invalid diagnosis entry: description missing.");
        }
    });

    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze image. The AI model may be unavailable or the image format is not supported.");
  }
};