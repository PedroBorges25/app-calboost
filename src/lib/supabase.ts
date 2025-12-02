import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          weight: number;
          height: number;
          gender: string;
          activity_level: string;
          goal: string;
          daily_calorie_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          weight: number;
          height: number;
          gender: string;
          activity_level: string;
          goal: string;
          daily_calorie_goal: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          weight?: number;
          height?: number;
          gender?: string;
          activity_level?: string;
          goal?: string;
          daily_calorie_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: string;
          foods: any;
          total_calories: number;
          total_protein: number;
          total_carbs: number;
          total_fat: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_type: string;
          foods: any;
          total_calories: number;
          total_protein: number;
          total_carbs: number;
          total_fat: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_type?: string;
          foods?: any;
          total_calories?: number;
          total_protein?: number;
          total_carbs?: number;
          total_fat?: number;
          created_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          workout_type: string;
          exercises: any;
          duration_minutes: number;
          calories_burned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          workout_type: string;
          exercises: any;
          duration_minutes: number;
          calories_burned: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          workout_type?: string;
          exercises?: any;
          duration_minutes?: number;
          calories_burned?: number;
          created_at?: string;
        };
      };
    };
  };
};
