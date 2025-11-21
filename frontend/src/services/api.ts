import type { DinnerDecision, Meal, MealCreate } from '../types/dinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getDinnerDecision(): Promise<DinnerDecision> {
  const response = await fetch(`${API_BASE_URL}/api/dinner/decision`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getMeals(): Promise<Meal[]> {
  const response = await fetch(`${API_BASE_URL}/api/meals`);
  if (!response.ok) throw new Error('Failed to fetch meals');
  return response.json();
}

export async function createMeal(meal: MealCreate): Promise<Meal> {
  const response = await fetch(`${API_BASE_URL}/api/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });
  if (!response.ok) throw new Error('Failed to create meal');
  return response.json();
}

export async function updateMeal(id: string, meal: MealCreate): Promise<Meal> {
  const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });
  if (!response.ok) throw new Error('Failed to update meal');
  return response.json();
}

export async function deleteMeal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete meal');
}
