export interface DinnerDecision {
  meal: string;
  cuisine: string;
  reason: string;
}

export interface Meal extends DinnerDecision {
  id: string;
}

export interface MealCreate {
  meal: string;
  cuisine: string;
  reason: string;
}
