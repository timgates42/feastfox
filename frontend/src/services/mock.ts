import type { DinnerDecision } from '../types/dinner';

const mockMeals: DinnerDecision[] = [
  {
    meal: 'Spaghetti Carbonara',
    cuisine: 'Italian',
    reason: 'Classic comfort food that never disappoints!',
  },
  {
    meal: 'Chicken Tikka Masala',
    cuisine: 'Indian',
    reason: 'Spicy and flavourful, perfect for an adventure!',
  },
  {
    meal: 'Tacos al Pastor',
    cuisine: 'Mexican',
    reason: 'Fresh and vibrant flavours for a festive evening!',
  },
  {
    meal: 'Pad Thai',
    cuisine: 'Thai',
    reason: 'Sweet, sour, and satisfying all at once!',
  },
  {
    meal: 'Salmon Teriyaki',
    cuisine: 'Japanese',
    reason: 'Healthy and delicious with a perfect glaze!',
  },
  {
    meal: 'Greek Moussaka',
    cuisine: 'Greek',
    reason: 'Hearty and Mediterranean, a true delight!',
  },
  {
    meal: 'Beef Pho',
    cuisine: 'Vietnamese',
    reason: 'Aromatic and warming, perfect for any mood!',
  },
];

export async function mockDinnerDecision(): Promise<DinnerDecision> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return random meal
  const randomIndex = Math.floor(Math.random() * mockMeals.length);
  return mockMeals[randomIndex];
}
