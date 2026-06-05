export type Status = 'DANGEROUS' | 'MODERATE' | 'FAIR' | 'GOOD';

export interface Zone {
  id: string;
  name: string;
  ppm: number;
  status: Status;
  aqi: number;
  trend: number[];
  causes: { name: string; value: number; color: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface SimulationState {
  greenBelt: number;
  traffic: number;
  industrial: number;
  projectedPpm: number;
}
