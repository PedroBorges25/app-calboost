export interface MealEntry {
  id: string;
  date: Date;
  imageUrl?: string;
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WorkoutEntry {
  id: string;
  date: Date;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dailyCalorieGoal: number;
}

export interface DailyStats {
  date: Date;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fats: number;
  waterIntake: number; // ml
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}
