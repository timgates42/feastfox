import type { DinnerDecision } from '../types/dinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getDinnerDecision(): Promise<DinnerDecision> {
  const response = await fetch(`${API_BASE_URL}/api/dinner/decision`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
