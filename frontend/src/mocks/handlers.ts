import { http, HttpResponse, delay } from 'msw';
import type { Meal, MealCreate, DinnerDecision } from '../types/dinner';

const mockMeals: Meal[] = [
  {
    id: '1',
    meal: 'Spaghetti Carbonara',
    cuisine: 'Italian',
    reason: 'Classic comfort food that never disappoints!',
  },
  {
    id: '2',
    meal: 'Chicken Tikka Masala',
    cuisine: 'Indian',
    reason: 'Spicy and flavourful, perfect for an adventure!',
  },
  {
    id: '3',
    meal: 'Tacos al Pastor',
    cuisine: 'Mexican',
    reason: 'Fresh and vibrant flavours for a festive evening!',
  },
  {
    id: '4',
    meal: 'Pad Thai',
    cuisine: 'Thai',
    reason: 'Sweet, sour, and satisfying all at once!',
  },
  {
    id: '5',
    meal: 'Salmon Teriyaki',
    cuisine: 'Japanese',
    reason: 'Healthy and delicious with a perfect glaze!',
  },
  {
    id: '6',
    meal: 'Greek Moussaka',
    cuisine: 'Greek',
    reason: 'Hearty and Mediterranean, a true delight!',
  },
  {
    id: '7',
    meal: 'Beef Pho',
    cuisine: 'Vietnamese',
    reason: 'Aromatic and warming, perfect for any mood!',
  },
];

let meals = [...mockMeals];

export const handlers = [
  http.get('/api/dinner/decision', async () => {
    await delay(800);
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    return HttpResponse.json(randomMeal);
  }),

  http.get('/api/meals', async () => {
    await delay(300);
    return HttpResponse.json(meals);
  }),

  http.post('/api/meals', async ({ request }) => {
    await delay(300);
    const newMeal = await request.json() as MealCreate;
    const meal: Meal = {
      id: String(Date.now()),
      ...newMeal,
    };
    meals.push(meal);
    return HttpResponse.json(meal, { status: 201 });
  }),

  http.put('/api/meals/:id', async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const updates = await request.json() as MealCreate;
    const index = meals.findIndex(m => m.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Meal not found' }, { status: 404 });
    }
    
    meals[index] = { ...meals[index], ...updates };
    return HttpResponse.json(meals[index]);
  }),

  http.delete('/api/meals/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const index = meals.findIndex(m => m.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Meal not found' }, { status: 404 });
    }
    
    meals.splice(index, 1);
    return HttpResponse.json(null, { status: 204 });
  }),
];
