
export interface Diagnosis {
  condition: string;
  probability: number;
  description: string;
}

export interface AttentionHotspot {
  x: number; // 0 to 1 (left to right)
  y: number; // 0 to 1 (top to bottom)
  radius: number; // 0 to 1 (percentage of smallest dimension)
}

export interface AnalysisResult {
  diagnoses: Diagnosis[];
  attentionHotspot: AttentionHotspot;
  summary: string;
}